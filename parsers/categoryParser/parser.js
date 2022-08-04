const puppeteer = require('puppeteer')
const fs = require('fs')
const to = require('../../utils/to')

;(async () => {
  const browser = await puppeteer.launch()
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT; Win 64; x64; rv:73.0) Gecko/20100101 Firefox/73.0'
  )
  await page.setViewport({ width: 1920, height: 1080 })
  const initLink = 'https://www2.hm.com/en_us/index.html'

  await page.goto(initLink)

  data = {}

  await (async () => {
    for (let categoryCount = 2; categoryCount <= 2 + 2; categoryCount++) {
      let category = await page.$eval(
        `body > header > nav > ul.menu__primary > li:nth-child(${categoryCount}) > a > span`,
        (el) => el.innerText
      )
      if (category === 'Divided') continue
      const totalCategoris = await page.evaluate(() => {
        return (
          Array.from(
            document.querySelector(
              'body > header > nav > ul.menu__primary > li.menu__super.menu__super--has-sub.js-traverse-trigger.menu__super--open > ul > li.menu__block.menu--unfolded > ul'
            ).children
          ).length - 27
        )
      })
    }

    console.log(data)

    // await page.screenshot({ path: 'page.png', fullPage: true })
    // const totalCategoris = await page.evaluate(() => {
    //   return (
    //     Array.from(
    //       document.querySelector(
    //         'body > header > nav > ul.menu__primary > li.menu__super.menu__super--has-sub.js-traverse-trigger.menu__super--open > ul > li.menu__block.menu--unfolded > ul'
    //       ).children
    //     ).length - 27
    //   )
    // })

    // for (
    //   let categorisCount = 3;
    //   categorisCount <= totalCategoris - 5;
    //   categorisCount++
    // ) {
    //   data.push()
    //   data[dataCount]
    // }
  })()
  await browser.close()
})()
