const createLogger = require('../../utils/logger')
const namer = require('color-namer')

const logger = createLogger('products/products.sql')

const parsProduct = async (page, categoryId, subcategoryId) => {
  await page.waitForSelector(`.still-life-images`)
  await page.click('.still-life-images')

  const productsImgs = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.item-image'), (el) => el.src)
  )

  const productNames = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.item-heading > a'),
      (el) => el.innerText
    )
  )

  const productsPrices = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.item-price > span'),
      (el) => el.innerText
    )
  )

  const productsLinks = await page.evaluate(() =>
    Array.from(document.querySelectorAll('.item-heading > a'), (el) => el.href)
  )

  const colorGroups = await page.evaluate(() =>
    Array.from(
      document.querySelectorAll('.list-swatches'),
      (el) => el.childElementCount
    )
  )

  const colors = []
  for (const [productCount, colorGroup] of colorGroups.entries()) {
    const productColors = []
    for (let colorCount = 1; colorCount <= colorGroup; colorCount++) {
      let color = await page.$eval(
        `#page-content > div > div:nth-child(4) > ul > li:nth-child(${
          productCount + 1
        }) > article > div.item-details > ul > li${
          colorGroup > 1 ? `:nth-child(${colorCount})` : ''
        } > a`,
        (el) => el.style.backgroundColor
      )

      productColors.push({
        name: namer(color).basic[0].name,
        rgb: color,
      })
    }
    colors.push(productColors)
  }

  for (let productCount = 0; productCount <= 35; productCount++) {
    await page.goto(productsLinks[productCount])

    await page.waitForSelector('.product-detail-thumbnail-image')
    let productImgs = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll('.product-detail-thumbnail-image'),
        (el) => el.src
      )
    )
    productImgs = productImgs.map((img) => `https:${img}`)

    const productSizes = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(
          '#picker-1 > ul > li > div > button > span.value:not(.oos)'
        ),
        (el) => el.innerText
      )
    )

    logger.write(
      `INSERT INTO product (id, "categoryId", "subcategoryId", color, name, "previewImg", imgs, price) VALUES (${
        productCount + 1
      }, ${categoryId}, ${subcategoryId}, '${JSON.stringify(
        colors[productCount][0]
      )}', '${productNames[productCount]}', '${
        productsImgs[productCount]
      }', '${JSON.stringify(productImgs)}', ${productsPrices[productCount]
        .replace(' ', '')
        .replace('$', '')});\n`
    )

    const sizes = ['XXS', 'XS', 'S', 'M', 'L', 'XL', 'XXL', '3XXL', '4XXL']

    for ([sizeCount, size] of productSizes.entries()) {
      if (sizes.indexOf(size) + 1 === 0)
        await page.screenshot({ path: 'page.png', fullPage: true })
      if (sizeCount > 0) {
        logger.write(
          `INSERT INTO products_sizes_size ("productsId", "sizeId") VALUES (${
            productCount + 1
          }, ${sizes.indexOf(size) + 1});\n`
        )
      }
    }
  }
}

module.exports = parsProduct
