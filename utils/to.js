module.exports = async (link, time = 2500) => {
  await page.goto(link)
  await page.waitForTimeout(time)
}
