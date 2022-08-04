const puppeteer = require('puppeteer')
const namer = require('color-namer')
const fs = require('fs')
// const to = require('../../utils/to')

const subCategoiesIds = [
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/shirts-blouses.html',
  //   id: 1,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/pants.html',
  //   id: 2,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/blazers-vests.html',
  //   id: 3,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/jeans.html',
  //   id: 4,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/shorts.html',
  //   id: 5,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/jumpsuits-rompers.html',
  //   id: 6,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/skirts.html',
  //   id: 7,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/shoes.html',
  //   id: 8,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/accessories.html',
  //   id: 9,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/swimwear.html',
  //   id: 10,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/cardigans-sweaters.html',
  //   id: 11,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/hoodies-sweatshirts.html',
  //   id: 12,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/lingerie.html',
  //   id: 13,
  //   categoryId: 1,
  // },
  // {
  //   link: 'https://www2.hm.com/en_us/women/products/loungewear.html',
  //   id: 14,
  //   categoryId: 1,
  // },
  {
    link: 'https://www2.hm.com/en_us/women/products/sleepwear.html',
    id: 15,
    categoryId: 1,
  },
  {
    link: 'https://www2.hm.com/en_us/women/products/socks-tights.html',
    id: 16,
    categoryId: 1,
  },
  {
    link: 'https://www2.hm.com/en_us/women/products/workout-clothes.html',
    id: 17,
    categoryId: 1,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/t-shirts-tank-tops.html',
    id: 18,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/pants.html',
    id: 2,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/shirts.html',
    id: 20,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/shorts.html',
    id: 5,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/hoodies-sweatshirts.html',
    id: 22,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/suits-blazers.html',
    id: 23,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/jackets-coats.html',
    id: 24,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/jeans.html',
    id: 25,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/accessories.html',
    id: 26,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/shoes.html',
    id: 27,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/cardigans-sweaters.html',
    id: 28,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/swim-wear-trunks.html',
    id: 29,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/sportswear.html',
    id: 30,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/underwear.html',
    id: 31,
    categoryId: 2,
  },
  {
    link: 'https://www2.hm.com/en_us/men/products/basics.html',
    id: 32,
    categoryId: 2,
  },
]

;(async () => {
  const browser = await puppeteer.launch({ headless: false })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT; Win 64; x64; rv:73.0) Gecko/20100101 Firefox/73.0'
  )
  let logger = fs.createWriteStream('data.sql', { flags: 'a' })
  page.setDefaultNavigationTimeout(0)
  let data = []
  await page.setViewport({ width: 1920, height: 1080 })

  const to = async (link, time = 2500) => {
    await page.goto(link, { waitUntil: 'networkidle0' })
    // await page.waitForTimeout(time)
  }
  // const to = async (link, time = 2500) => {
  //   await page.goto(link)
  //   await page.waitForTimeout(time)
  // }

  for (const subCategory of subCategoiesIds) {
    let initLink = `${subCategory.link}?page-size=40`

    await to(initLink)
    subCategory.id === subCategoiesIds[0].id &&
      (await page.click('#onetrust-accept-btn-handler'))

    await (async () => {
      await page.screenshot({ path: 'page.png', fullPage: true })

      const totalProducts = await page.evaluate(
        () => document.querySelectorAll('.product-item').length
      )

      let productsImgs = await page.evaluate(() =>
        Array.from(document.querySelectorAll('.item-image'), (el) => el.src)
      )

      let productsNames = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('.item-heading > a'),
          (el) => el.innerText
        )
      )

      let productsLinks = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('.item-heading > a'),
          (el) => el.href
        )
      )

      const colorsCount = await page.evaluate(() =>
        Array.from(
          document.querySelectorAll('.list-swatches'),
          (el) => el.childElementCount
        )
      )

      for (
        let productsCount = 1;
        productsCount <= totalProducts;
        productsCount++
      ) {
        let product = {}
        console.log(`${productsCount}/${totalProducts}`)

        try {
          await (
            await page.waitForSelector('label[for=image-stillLife]')
          ).click()

          //ProdcuctsListPage
          product.img = productsImgs[productsCount]
          product.name = productsNames[productsCount]
          product.price = Math.floor(Math.random() * 55)

          let colors = []
          for (let colorCount = 1; colorCount <= colorsCount; colorCount++) {
            let color = ''
            try {
              color = await page.$eval(
                `#page-content > div > div:nth-child(4) > ul > li:nth-child(${productsCount}) > article > div.item-details > ul > li:nth-child(${colorCount}) > a`,
                (el) => el.style.backgroundColor
              )
            } catch (error) {
              color = await page.$eval(
                `#page-content > div > div:nth-child(3) > ul > li:nth-child(${productsCount}) > article > div.item-details > ul > li:nth-child(${colorCount}) > a`,
                (el) => el.style.backgroundColor
              )
            }
            colors.push({ name: namer(color).basic[0].name, rgb: color })
          }
          product.colors = colors

          await to(productsLinks[productsCount], 5000)
          //ProductPage

          let showcaseCount = await page.evaluate(() => {
            return Array.from(document.querySelector('.group').children).length
          })

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
            await page.waitForTimeout(4000)

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
            showcaseItems[showcaseItemCount].id = showcaseItemCount + 1
          }
          product.showCase = showcaseItems
          // data[productsCount - 1].showCase = showcaseItems

          // avaliable sizes, mb leater {
          // await page.click('#picker-1 > button')

          // const sizesCount = await page.evaluate(
          //   () => document.querySelector('.picker-list').childElementCount,
          // )

          // console.log(sizesCount)

          // #picker-1 > ul > li:nth-child(2) > div > button > span
          // }

          //back to productListPage

          logger.write(
            `INSERT INTO products ("categoryId", "subcategoryId", img, name, price, colors, showCase) VALUES (${
              subCategory.categoryId
            }, ${subCategory.id}, '${product.img}','${product.name}',${
              product.price
            },'${JSON.stringify(product.colors)}','${JSON.stringify(
              product.showCase
            )}');\n`
          )
          await to(initLink)
        } catch (err) {
          console.log(err)
          await to(initLink)
        }
      }
    })()
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

  // data.forEach((product) => {
  //   logger.write(
  //     `INSERT INTO products ("categoryId", subCategoryId, img, name, price, colors, showCase) VALUES (2, 30, '${
  //       product.img
  //     }','${product.name}',${product.price},'{"${product.colors.join(
  //       '","'
  //     )}"}','${JSON.stringify(product.showCase)}');\n`
  //   )
  // })

  await browser.close()
})()
