module.exports = function (plop) {
  // create your generators here

  plop.setGenerator("route", {
    description: "application route logic",
    prompts: [
      {
        type: "input",
        name: "version",
        message: "Please enter version name",
      },
      {
        type: "input",
        name: "group",
        message: "Please enter group name",
      },
      {
        type: "input",
        name: "name",
        message: "Please enter route name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "routes/{{version}}/{{group}}/{{name}}.js",
        templateFile: "plop-templates/route.hbs",
      },
    ],
  });

  plop.setGenerator("controller", {
    description: "application controller logic",
    prompts: [
      {
        type: "input",
        name: "version",
        message: "Please enter version name",
      },
      {
        type: "input",
        name: "group",
        message: "Please enter group name",
      },
      {
        type: "input",
        name: "name",
        message: "Please enter controller name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "controllers/{{version}}/{{group}}/{{name}}.js",
        templateFile: "plop-templates/controller.hbs",
      },
    ],
  });

  plop.setGenerator("service", {
    description: "application service logic",
    prompts: [
      {
        type: "input",
        name: "version",
        message: "Please enter version name",
      },
      {
        type: "input",
        name: "name",
        message: "Please enter file name",
      },
      {
        type: "input",
        name: "serviceName",
        message: "Please enter service name",
      },
    ],
    actions: [
      {
        type: "add",
        path: "service/{{version}}/{{name}}.js",
        templateFile: "plop-templates/service.hbs",
      },
    ],
  });
};
