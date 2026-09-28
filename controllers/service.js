const Service = require('../models/Service.js');
const Address = require('../models/Address.js');
const { pagination, capitalizeFirstLetter } = require('../helper/index.js');

// Create Service
const createService = async (req, res) => {
    try {
        const service = new Service(req.body);
        await service.save();
        return res.status(201).json({ message: "Service created successfully", data: service });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
};

// Update Service
const updateService = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Service id is required" });
        }
        const service = await Service.findByIdAndUpdate(id, req.body, { new: true });
        return res.status(200).json({ message: "Service updated successfully", data: service });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
};

// Get Services
const getServices = async (req, res) => {
    try {
        let filter = {};
        let { limit, skip } = pagination(req);

        const services = await Service.find(filter)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const serviceCount = await Service.countDocuments(filter);
        return res.status(200).json({
            message: "Services fetched successfully",
            data: services,
            count: serviceCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
};
async function handleLocation(location) {
    if (location == "") {
        return location;
    }
    location = capitalizeFirstLetter(location);
    let [city, state, district] = await Promise.all([
        Address.findOne({ city: location }),
        Address.findOne({ state: location.toUpperCase() }),
        Address.findOne({ district: location })
    ]);
    console.log("city :"+city);
    console.log("state :"+state);
    console.log("district :"+district);
    if (city) {
        location = city.city;
    } else if (district) {
        location = district.district;
    } else if (state) {
        location = capitalizeFirstLetter(state.state);
    }else{
        location = "";
    }
    return location;
}
const getPublicServicesBySlug = async (req, res) => {
    try {
        const segments = [];
        if (req.params.pre) segments.push(req.params.pre);
        if (req.params.service) segments.push(req.params.service);
        if (req.params.location) segments.push(req.params.location);
        if (req.params.post) segments.push(req.params.post);

        // Find service in DB by checking if any segment matches slug
        const service = await Service.findOne({ slug: { $in: segments } }).lean();
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }

        const serviceIndex = segments.indexOf(service.slug);
        
        let pre = undefined;
        let post = undefined;
        let location = undefined;
        let isValid = true;

        // Parse pre
        if (serviceIndex === 1) {
            pre = segments[0];
            const isPreAllowed = service.pre && service.pre.some(p => p.toLowerCase() === pre.toLowerCase());
            if (!isPreAllowed) {
                isValid = false;
            }
        } else if (serviceIndex > 1) {
            isValid = false;
        }

        // Parse post and location
        const afterSegments = segments.slice(serviceIndex + 1);
        if (afterSegments.length === 1) {
            const seg = afterSegments[0];
            // Check location first
            const locationMatch = await Address.findOne({
                $or: [
                    { city: { $regex: new RegExp(`^${seg}$`, 'i') } },
                    { district: { $regex: new RegExp(`^${seg}$`, 'i') } },
                    { state: { $regex: new RegExp(`^${seg}$`, 'i') } }
                ]
            });

            if (locationMatch) {
                if (locationMatch.city.toLowerCase() === seg.toLowerCase()) {
                    location = locationMatch.city;
                } else if (locationMatch.district.toLowerCase() === seg.toLowerCase()) {
                    location = locationMatch.district;
                } else {
                    location = capitalizeFirstLetter(locationMatch.state);
                }
            } else {
                const isPostAllowed = service.post && service.post.some(p => p.toLowerCase() === seg.toLowerCase());
                if (isPostAllowed) {
                    post = seg;
                } else {
                    isValid = false;
                }
            }
        } else if (afterSegments.length === 2) {
            const seg1 = afterSegments[0];
            const seg2 = afterSegments[1];

            const isPostAllowed = service.post && service.post.some(p => p.toLowerCase() === seg1.toLowerCase());
            const locationMatch = await Address.findOne({
                $or: [
                    { city: { $regex: new RegExp(`^${seg2}$`, 'i') } },
                    { district: { $regex: new RegExp(`^${seg2}$`, 'i') } },
                    { state: { $regex: new RegExp(`^${seg2}$`, 'i') } }
                ]
            });

            if (isPostAllowed && locationMatch) {
                post = seg1;
                if (locationMatch.city.toLowerCase() === seg2.toLowerCase()) {
                    location = locationMatch.city;
                } else if (locationMatch.district.toLowerCase() === seg2.toLowerCase()) {
                    location = locationMatch.district;
                } else {
                    location = capitalizeFirstLetter(locationMatch.state);
                }
            } else {
                isValid = false;
            }
        } else if (afterSegments.length > 2) {
            isValid = false;
        }

        // Standardize the capitalization of parsed values
        const formattedPre = pre ? capitalizeFirstLetter(pre) : undefined;
        const formattedPost = post ? capitalizeFirstLetter(post) : undefined;
        const formattedLoc = location ? capitalizeFirstLetter(location) : undefined;

        // Generate Canonical URL
        const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://itsoftworld.com';
        const urlPathSegments = ['services', formattedPre, service.slug, formattedPost, formattedLoc]
            .filter(Boolean)
            .map(s => s.toLowerCase());
        const canonical = `${siteUrl.replace(/\/+$/, '')}/${urlPathSegments.join('/')}`;

        // Prepare placeholder variables for replacement
        const placeholderVars = {
            pre: formattedPre || '',
            post: formattedPost || '',
            location: formattedLoc || '',
            service: service.shortHeading || service.heading || '',
            shortHeading: service.shortHeading || '',
            category: service.category || ''
        };

        // Import the placeholder helper
        const { replacePlaceholders } = require('../helper/placeholder.js');

        // Apply templates (or use base fields if templates not specified)
        const generatedHeading = replacePlaceholders(service.headingTemplate || service.heading || '', placeholderVars);
        const generatedSubHeading = replacePlaceholders(service.subHeadingTemplate || service.subHeading || '', placeholderVars);
        const generatedDescription = replacePlaceholders(service.descriptionTemplate || service.description || '', placeholderVars);

        // SEO Title and Description
        const generatedSeoTitle = generatedHeading;
        const generatedSeoDescription = generatedDescription;

        return res.status(200).json({
            message: "Service fetched successfully",
            data: {
                ...service,
                heading: generatedHeading,
                subHeading: generatedSubHeading,
                description: generatedDescription,
                seoTitle: generatedSeoTitle,
                seoDescription: generatedSeoDescription,
                canonical: canonical,
                isValid: isValid,
                redirectUrl: `/services/${service.slug}`,
                variables: {
                    pre: formattedPre || null,
                    post: formattedPost || null,
                    location: formattedLoc || null
                }
            }
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
};

const getPublicServicesList = async (req, res) => {
    try {
        let filter = {};
        let { limit, skip } = pagination(req);
        if(req.query.category) {
            filter.category = req.query.category;
        }
        if(req.query.search) {
            filter.heading = { $regex: new RegExp(req.query.search, 'i') };
        }
        const services = await Service.find(filter).select("slug heading subHeading pre post").lean()
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(limit);

        const serviceCount = await Service.countDocuments(filter);
        return res.status(200).json({
            message: "Services fetched successfully",
            data: services,
            count: serviceCount
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}

const getServicesById = async (req, res) => {
    try {
        const { id } = req.params;
        if (!id) {
            return res.status(400).json({ message: "Service id is required" });
        }
        const service = await Service.findById(id);
        if (!service) {
            return res.status(404).json({ message: "Service not found" });
        }
        return res.status(200).json({ message: "Service fetched successfully", data: service });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
}

const getServiceSitemapData = async (req, res) => {
    try {
        const services = await Service.find({}).select("slug pre post createdAt").lean();
        const addresses = await Address.find({}).select("city district state").lean();
        
        const locations = [];
        const seen = new Set();
        for (const addr of addresses) {
            const locs = [addr.city, addr.district, addr.state].filter(Boolean);
            for (let loc of locs) {
                loc = capitalizeFirstLetter(loc);
                if (!seen.has(loc.toLowerCase())) {
                    seen.add(loc.toLowerCase());
                    locations.push(loc);
                }
            }
        }

        return res.status(200).json({
            message: "Sitemap data fetched successfully",
            data: {
                services,
                locations
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ error: error.message, message: "Error in server" });
    }
};

module.exports = {
    createService,
    updateService,
    getServices,
    getPublicServicesList,
    getPublicServicesBySlug,
    getServicesById,
    getServiceSitemapData
};