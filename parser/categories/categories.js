const parsSubcategories = require('../subcategories/subcategories')
const createLogger = require('../../utils/logger')

const parsCategories = async (page) => {
  const logger = createLogger('categories/categories.sql')

  for (let categoryId = 1; categoryId <= 2; categoryId++) {
    const category = await page.waitForSelector(
      `#__next > header > nav > div.__2utV > div > div.__5f_w > ul > li:nth-child(${categoryId}) > a`
    )
    const categoryTitle = await category.evaluate(
      (category) => category.textContent
    )

    logger.write(
      `INSERT INTO category (id, name) VALUES (${categoryId}, '${categoryTitle}');\n`
    )

    await parsSubcategories(page, categoryId)
  }
}

module.exports = parsCategories
