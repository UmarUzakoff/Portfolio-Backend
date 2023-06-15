class Project {
  constructor(id, name, image, usedTechnologies = [], link, description) {
    this.id = id;
    this.name = name;
    this.image = image;
    this.usedTechnologies = usedTechnologies;
    this.link = link;
    this.description = description;
  }
}

module.exports = Project;
