const puppeteer = require('puppeteer')
const fs = require('fs')
// const to = require('../../utils/to')

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT; Win 64; x64; rv:73.0) Gecko/20100101 Firefox/73.0'
  )
  let data = []
  await page.setViewport({ width: 1920, height: 1080 })

  const to = async (link, time = 2500) => {
    await page.goto(link)
    await page.waitForTimeout(time)
  }

  await to(subcategoryLink)
  console.log(subcategoryLink)

  await (async () => {
    const totalProducts = await page.evaluate(
      () => document.querySelectorAll('.product-item').length
    )

    // await page.click(
    //   '#page-content > div > div:nth-child(4) > div.products-filter-container > div.products-filter.sticky-on-scroll > form > fieldset.filter-toggleimages.js-filter-toggleimages > ul > li:nth-child(2) > label',
    // )

    for (
      let productsCount = 1;
      productsCount <= totalProducts;
      productsCount++
    ) {
      data.push({})

      productsCountStr = productsCount.toString()

      //ProdcuctsListPage

      data[productsCount - 1].img = await page.$eval(
        `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.image-container > a > img`,
        (el) => el.src
      )

      data[productsCount - 1].name = await page.$eval(
        `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.item-details > h3 > a`,
        (el) => el.innerText
      )

      // const textPrice = await page.$eval(
      //   `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.item-details > strong > span`,
      //   (el) => el.innerText,
      // )
      // data[productsCount - 1].price = +textPrice.substring(2)

      data[productsCount - 1].price = Math.random() * 100

      const colorsCount = await page.$eval(
        `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.item-details > ul`,
        (el) => el.childElementCount
      )
      let colors = []

      for (let colorCount = 1; colorCount <= colorsCount; colorCount++) {
        const color = await page.$eval(
          `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.item-details > ul > li:nth-child(${colorCount.toString()}) > a`,
          (el) => el.style.backgroundColor
        )
        colors.push(color)
      }
      data[productsCount - 1].colors = colors

      //ProductPage
      let link = await page.$eval(
        `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.image-container > a`,
        (el) => el.href
      )

      await to(link, 5000)

      let showcaseCount = await page.$eval(
        `.group`,
        (el) => el.childElementCount
      )

      const colorLink = await page.$$eval('.filter-option', (a) =>
        a.map(({ href }) => href)
      )

      showcaseItems = []
      for (
        let showcaseItemCount = 0;
        showcaseItemCount < showcaseCount;
        showcaseItemCount++
      ) {
        let productId = colorLink[showcaseItemCount].match(/\d{2,}/)
        let imgs = []
        showcaseItems[showcaseItemCount] = {}

        await page.click(`#filter-colour-${productId} > img`)
        await page.waitForTimeout(3000)

        imgs.push(
          await page.$eval(
            '#main-content > div.product.parbase > div.layout.pdp-wrapper.product-detail.sticky-footer-wrapper.js-reviews > div.module.product-description.sticky-wrapper > figure.pdp-image.product-detail-images.product-detail-main-image > div > img',
            (el) => el.src
          )
        )

        let secondImgs = await page.$$eval(
          '.product-detail-thumbnail-image',
          (img) => img.map(({ src }) => src)
        )

        imgs.push(...imgs, ...secondImgs)

        let showcaseMiniImg = await page.$eval(
          `#filter-colour-${productId} > img`,
          (el) => el.src
        )

        showcaseItems[showcaseItemCount].miniImg = showcaseMiniImg
        showcaseItems[showcaseItemCount].imgs = imgs
      }
      data[productsCount - 1].showCase = showcaseItems

      // avaliable sizes, mb leater {
      // await page.click('#picker-1 > button')

      // const sizesCount = await page.evaluate(
      //   () => document.querySelector('.picker-list').childElementCount,
      // )

      // #picker-1 > ul > li:nth-child(2) > div > button > span
      // }

      //back to productListPage

      await page.click(
        '#page-content > div > div:nth-child(4) > div.products-filter-container > div.products-filter.sticky-on-scroll > form > fieldset.filter-toggleimages.js-filter-toggleimages > ul > li:nth-child(2) > label'
      )
    }
    // Convert obj in sql querys

    // logger.write(`CREATE TABLE products(
    //   id SERIAL,
    //   img VARCHAR ,
    //   name VARCHAR ,
    //   price NUMERIC ,
    //   colors TEXT[],
    //   showCase json,
    //   views NUMERIC
    // );\n`)

    let logger = fs.createWriteStream('data.sql')

    data.forEach((product) => {
      logger.write(
        `INSERT INTO products ("categoryId", "subcategoryId", price, img, name, colors, showCase) VALUES (${
          product.categoryId
        },${product.subcategoryId},${product.price},'${product.img}','${
          product.name
        }','{"${product.colors.join('","')}"}','${JSON.stringify(
          product.showCase
        )}',);\n`
      )
    })
  })()
  await browser.close()
})()
