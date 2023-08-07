const parsProduct = require('../products/product')

const createLogger = require('../../utils/logger')
const { INITIAL_LINK } = require('../../constants/constants')
let logger = createLogger('subcategories/subcategories.sql')
const subcategories = []
// : { id: number; name: string }[]
let maxSubcategoryId = 1
let currentSubcategoryId = 1

const parsSubcategories = async (page, categoryId) => {
  for (let subcategoryItem = 3; subcategoryItem <= 8; subcategoryItem++) {
    let isNewSubcategory = true

    const subcategory = await page.waitForSelector(
      `#__next > header > nav > div.__2utV > div > div.__5f_w > ul > li:nth-child(${categoryId}) > div > ul > li:nth-child(5) > ul > li:nth-child(${subcategoryItem}) > a`
    )
    const subcategoryTitle = await subcategory?.evaluate(
      (category) => category.textContent
    )

    for (let { id, name } of subcategories) {
      if (name === subcategoryTitle) {
        currentSubcategoryId = id
        isNewSubcategory = false
        break
      }
    }

    if (isNewSubcategory && subcategoryTitle) {
      subcategories.push({
        id: maxSubcategoryId,
        name: subcategoryTitle,
      })

      logger.write(
        `INSERT INTO subcategory (id, name) VALUES (${currentSubcategoryId}, '${subcategoryTitle}');\n`
      )
    }

    logger.write(
      `INSERT INTO category_subcategories_subcategory ("categoryId", "subcategoryId") VALUES (${categoryId}, ${currentSubcategoryId});\n`
    )

    const productListUrl = await subcategory?.evaluate((category) =>
      category.getAttribute('href')
    )
    await page.goto(`https://www2.hm.com/${productListUrl}`)
    if (productListUrl) {
      await parsProduct(page, categoryId, currentSubcategoryId)
    }

    if (isNewSubcategory) maxSubcategoryId++
    currentSubcategoryId = maxSubcategoryId
  }
}

module.exports = parsSubcategories
