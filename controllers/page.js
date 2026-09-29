const BaseController = require("../core/BaseController")
const Page = require('../models/Page');
const Project = require('../models/Project');
const config = require('../config/config');

const pageController = new BaseController(Page, {
  name: 'Page ',
  access: 'admin',
  get: {
    pagination: config.pagination, // pagination only for get 
    query: ["url", "pageKey", "user"], // for filter 
    sort: { createdAt: -1 }, // sort by createdAt in descending order
  },
  getById: {
    pre: async (id, req, res) => {
      let page = await Page.findOne({ url: id });
      if (!page) {
        return res.status(404).json({ message: `Page not found` });
      }
      id = page._id;
    }
  }
});

const projectController = new BaseController(Project, {
  name: 'Project',
  access: 'admin',
  get: {
    pagination: config.pagination,
    query: ["slug", "category", "user"],
    sort: { createdAt: -1 },
  },
  getById: {
    pre: async (id, req, res) => {
      let project = await Project.findOne({ slug: id });
      if (!project) {
        return res.status(404).json({ message: `Project not found` });
      }
      id = project._id;
    }
  }

});


module.exports = { pageController, projectController };
