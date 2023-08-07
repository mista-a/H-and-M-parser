const puppeteer = require('puppeteer')
const parsCategories = require('./categories/categories')
const { INITIAL_LINK } = require('../constants/constants')

;(async () => {
  const browser = await puppeteer.launch({ headless: true })
  const page = await browser.newPage()
  await page.setUserAgent(
    'Mozilla/5.0 (Windows NT; Win 64; x64; rv:73.0) Gecko/20100101 Firefox/73.0'
  )
  await page.setViewport({ width: 1920, height: 1080 })

  page.goto(INITIAL_LINK)

  await parsCategories(page)

  // await browser.close()
})()
