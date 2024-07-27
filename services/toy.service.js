import { utilService } from './util.service.js'

export const toyService = {
  query,
  getById,
  save,
  remove,
}

var toys = utilService.readJsonFile('./data/toy.json')

function query(filterBy) {
  var filteredToys = toys

  if (filterBy.txt) {
    const regExp = new RegExp(filterBy.txt, 'i')
    filteredToys = filteredToys.filter(toy => regExp.test(toy.description) || regExp.test(toy.title))
  }

  if (filterBy.minPrice) {
    filteredToys = filteredToys.filter(toy => toy.price >= filterBy.minPrice)
  }
  return Promise.resolve(filteredToys)
}

function getById(toyId) {
  const toy = toys.find(toy => toy._id === toyId)
  return Promise.resolve(toy)
}

function remove(toyId) {
  const idx = toys.findIndex(toy => toy._id === toyId)
  toys.splice(idx, 1)

  return _saveToysToFile()
}

function save(toyToSave) {
  if (toyToSave._id) {
    const idx = toys.findIndex(toy => toy._id === toyToSave._id)
    toys.splice(idx, 1, toyToSave)
  } else {
    toyToSave._id = utilService.makeId()
    toyToSave.createdAt = Date.now()
    toys.push(toyToSave)
  }
  return _saveToysToFile()
    .then(() => toyToSave)
}

function _saveToysToFile() {
  return utilService.writeJsonFile('./data/toy.json', toys)
}