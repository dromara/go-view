const storeGenerator = require('./store-template/prompt')

module.exports = (plop) => {
  plop.setGenerator('store', storeGenerator)
}
