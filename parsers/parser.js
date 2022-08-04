const puppeteer = require('puppeteer')
const fs = require('fs')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT; Win 64; x64; rv:73.0) Gecko/20100101 Firefox/73.0'
  )
  await page.setViewport({ width: 1920, height: 1080 })
  const initLink = 'https://www2.hm.com/en_us/index.html'

  await page.goto(initLink)

  const to = async (link, time = 2500) => {
    await page.goto(link)
    await page.waitForTimeout(time)
  }

  subCategoiesIds = {
    Dresses: 1,
    Tops: 2,
    Basics: 3,
    'Shirts & Blouses': 4,
    Pants: 5,
    Blazers: 6,
    Jeans: 7,
    Shorts: 8,
    'Overalls & Jumpsuits': 9,
    Skirts: 10,
    Shoes: 11,
    Accessories: 12,
    'Swimwear & Beachwear': 13,
    'Cardigans & Sweaters': 14,
    'Jackets & Coats': 15,
    'Hoodies & Sweatshirts': 16,
    Lingerie: 17,
    Loungewear: 18,
    Sleepwear: 19,
    'Socks & Tights': 20,
    Activewear: 21,
    'T-shirts & Tanks': 22,
    Shirts: 23,
    'Suits & Blazers': 24,
    Underwear: 25,
    Basics: 26,
    'Sleepwear & Loungewear': 27,
  }

  data = []

  await (async () => {
    for (let categoryCount = 2; categoryCount < 2 + 2; categoryCount++) {
      let category = ''
      try {
        category = await page.$eval(
          `body > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > a > span`,
          (el) => el.innerText
        )
        await page.hover(
          `body > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > a > span`
        )
      } catch {
        category = await page.$eval(
          `body > div:nth-child(40) > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > a > span`,
          (el) => el.innerText
        )
        await page.hover(
          `body > div:nth-child(40) > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > a > span`
        )
      }
      if (category === 'Divided') continue

      let totalCategories
      try {
        totalCategories = await page.evaluate(() => {
          return Array.from(
            document.querySelector(
              'body > header > nav > ul.menu__primary > li.menu__super.menu__super--has-sub.js-traverse-trigger.menu__super--open > ul > li.menu__block.menu--unfolded > ul'
            ).children
          ).length
        })
      } catch {
        totalCategories = await page.evaluate(() => {
          return Array.from(
            document.querySelector(
              'body > div:nth-child(40) > header > nav > ul.menu__primary > li.menu__super.menu__super--has-sub.js-traverse-trigger.menu__super--open > ul > li.menu__block.menu--unfolded > ul'
            ).children
          ).length
        })
      }

      await (async () => {
        for (
          let subcategoryCount = 3;
          subcategoryCount < totalCategories - 4;
          subcategoryCount++
        ) {
          let subcategory
          let subcategoryLink
          try {
            subcategory = await page.$eval(
              `body > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > ul > li.menu__block.menu--unfolded > ul > li:nth-child(${subcategoryCount}) > a`,
              (el) => el.innerText
            )
            subcategoryLink = await page.$eval(
              `body > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > ul > li.menu__block.menu--unfolded > ul > li:nth-child(${subcategoryCount}) > a`,
              (el) => el.href
            )
          } catch {
            subcategory = await page.$eval(
              `body > div:nth-child(40) > header > nav > ul.menu__primary > li.menu__super.menu__super--has-sub.js-traverse-trigger.menu__super--open > ul > li.menu__block.menu--unfolded > ul > li:nth-child(${subcategoryCount}) > a`,
              (el) => el.innerText
            )
            subcategoryLink = await page.$eval(
              `body > div:nth-child(40) > header > nav > ul.menu__primary > li.menu__super.menu__super--has-sub.js-traverse-trigger.menu__super--open > ul > li.menu__block.menu--unfolded > ul > li:nth-child(${subcategoryCount}) > a`,
              (el) => el.href
            )
          }

          console.log(subcategory)
          await to(subcategoryLink)

          await (async () => {
            const totalProducts = await page.evaluate(
              () => document.querySelectorAll('.product-item').length
            )

            for (
              let productsCount = 1;
              productsCount <= totalProducts;
              productsCount++
            ) {
              data.push({})

              data[productsCount - 1].categoryId = categoryCount - 1
              data[productsCount - 1].subcategoryId =
                subCategoiesIds[subcategory]
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

              const textPrice = await page.$eval(
                `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.item-details > strong > span`,
                (el) => el.innerText
              )
              data[productsCount - 1].price = +textPrice.substring(2)

              const colorsCount = await page.$eval(
                `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCountStr}) > article > div.item-details > ul`,
                (el) => el.childElementCount
              )
              let colors = []

              for (
                let colorCount = 1;
                colorCount <= colorsCount;
                colorCount++
              ) {
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
                `#main-content > div.product.parbase > div.layout.pdp-wrapper.product-detail.sticky-footer-wrapper.js-reviews > div.module.product-description.sticky-wrapper > div.sub-content.product-detail-info.product-detail-meta.inner.sticky-on-scroll.semi-sticky > div > div.product-colors.miniatures.clearfix.slider-completed.loaded > div > ul > li > ul`,
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

              // console.log(sizesCount)

              // #picker-1 > ul > li:nth-child(2) > div > button > span
              // }

              //back to productListPage

              await to(subcategoryLink)
              await page.click(
                '#page-content > div > div:nth-child(4) > div.products-filter-container > div.products-filter.sticky-on-scroll > form > fieldset.filter-toggleimages.js-filter-toggleimages > ul > li:nth-child(2) > label'
              )

              console.log(`${productsCount}/${totalProducts}`)
            }
            //Convert obj in sql querys

            // console.log(data)

            // logger.write(`CREATE TABLE products(
            //   id SERIAL,
            //   img VARCHAR ,
            //   name VARCHAR ,
            //   price NUMERIC ,
            //   colors TEXT[],
            //   showCase json,
            //   views NUMERIC
            // );\n`)
          })()
        }
      })()
    }
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
