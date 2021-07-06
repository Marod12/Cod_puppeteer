require('dotenv').config();
const puppeteer = require('puppeteer');

// lib do puppeteer = https://github.com/puppeteer/puppeteer

async function robo() {
  const browser = await puppeteer.launch({
      headless: true,
    });
  const page = await browser.newPage();
  // mudando a visualização da página
  await page.setViewport({
    width:1080,
    height:1000
  })
  // vai para a página selecionada
  await page.goto('https://profile.callofduty.com/cod/login?redirectUrl=https%3A%2F%2Fmy.callofduty.com%2Flogin');
  
  // Coloca os dados no formulario
  await page.type('#username', process.env.EMAIL);
  await page.type('#password', process.env.PASS);

  // Logando
  await page.waitForTimeout(2000); // espera
  await page.click('[type="submit"]');
  console.log('Logado com Sucesso');

  // Passando de uma pagina de pergunta
  //await page.waitForTimeout(10000); // espera
  //await page.waitForNavigation(browser);
  //await page.click('button[id="proceed-button"]');
  //console.log('Passou da primeira verificação');

  // Vai para a pagina de últimas partidas
  await page.waitForTimeout(10000); // espera
  await page.goto('https://my.callofduty.com/player/recentmatches');
  console.log('Acessou a página de recent matches');

  // Pegando os dados da página
  await page.waitForTimeout(10000); // espera
  const lastMatch = await page.evaluate(() => [...document.querySelectorAll('li[class="recentmatches-listing__item item-active"]')].map(li => li.innerText))
  // verificando retornos
  //console.log(lastMatch);
  //console.log(lastMatch.length);
  //console.log(lastMatch[0]);
  //console.log(lastMatch[0].split('\n'));
  //console.log(typeof(lastMatch));

  const itens = lastMatch[0].split('\n'); // colocando os 

  // clicandp na última partida
  await page.click('li[class="recentmatches-listing__item item-active"]')[0];
  await page.waitForTimeout(5000); // espera

  // headshot
  const headshot = await page.evaluate(() => [...document.querySelectorAll('li[class="col-details col-details-2"]')].map(li => li.innerText))
  // morte
  const death = await page.evaluate(() => [...document.querySelectorAll('li[class="col-details col-details-3"]')].map(li => li.innerText))
  // tempo da partida
  const timePlayer = await page.evaluate(() => [...document.querySelectorAll('li[class="col-details col-details-10"]')].map(li => li.innerText))

  // retorno no console.log
  console.log('  __ Última partida __');
  console.log(`    Ficou em ${itens[3]}°`);
  console.log(`    Modo ${itens[1]}`);
  console.log(`    ${itens[2]}`);
  console.log(`    Kills ${itens[5]}`);
  console.log(`    Damage ${itens[9]}`);
  console.log(`    Headshot ${headshot[0].split('\n')[0]}`);
  console.log(`    Morreu ${death[0].split('\n')[0]} vezes`);
  console.log(`    Tempo da partida ${timePlayer[0].split('\n')[0]}`);

  // print
  //await page.screenshot({path:'lastMatch.png', fullscreen:true}); // tira print da pagina a página
  
  if(itens[3] === '1') {
    await page.click('a[class="selectedmatch-header__link"]');
    // print
    await page.screenshot({path:'scoreBoard.png', fullscreen:true}); // tira print da pagina a página
  }

  await browser.close();
}

robo();