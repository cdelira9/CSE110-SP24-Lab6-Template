describe('Basic user flow for Website', () => {
  // First, visit the lab 8 website
  beforeAll(async () => {
    await page.goto('http://127.0.0.1:5500/index.html');
  });

it('Initial Home Page - Check for 0 notes', async() => {
  console.log('Checking for 0 notes when opened');
  const numNotes = await page.$$eval('stickynotes-notes', (notes) => {
    return notes.length;
  });
  // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
  expect(numNotes).toBe(0);
})

it('Mouseout - Read Add Note', async() => {
  console.log('Checking if when mouse is down the button reads add note');
  // Trigger mouseout event on the button
  await page.hover('button'); // Simulate hovering over the button
  await page.mouse.move(0, 0); // Move the mouse out of the button area

  await page.waitForSelector('button'); 
  const buttonText = await page.$eval('button', button => button.innerText.trim());

  expect(buttonText).toBe('Add Note');
})

it('Mouseon - Read +', async() => {
  console.log('Checking if when mouse is on the button reads +');
  // Trigger mouseout event on the button
  await page.hover('button'); // Simulate hovering over the button

  await page.waitForSelector('button'); 
  const buttonText = await page.$eval('button', button => button.innerText.trim());

  expect(buttonText).toBe('+');
})

it('Adding notes', async() => {
  await page.click('.add-note');
  await page.waitForSelector('textarea.note');
  await page.type('textarea.note', 'This is a test note. ');
  await page.$eval('textarea.note', element => element.dispatchEvent(new Event('change')));
  const numNotes = await page.$$eval('.note', (notes) => notes.length);
  expect(numNotes).toBe(1);

})


it('Reload page', async() => {
  await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
  const numNotes = await page.$$eval('.note', (notes) => notes.length);
  expect(numNotes).toBe(1);
})

it('Delete note', async() => {
  const firstNote = await page.$('.note');

  // Double-click on the first note to delete it
  await firstNote.click({ clickCount: 2 });


  // Verify that there are no notes left
  const numNotes = await page.$$eval('.note', (notes) => notes.length);
  expect(numNotes).toBe(0);
})



  // // Next, check to make sure that all 20 <product-item> elements have loaded
  // it('Initial Home Page - Check for 20 product items', async () => {
  //   console.log('Checking for 20 product items...');
  //   // Query select all of the <product-item> elements and return the length of that array
  //   const numProducts = await page.$$eval('product-item', (prodItems) => {
  //     return prodItems.length;
  //   });
  //   // Expect there that array from earlier to be of length 20, meaning 20 <product-item> elements where found
  //   expect(numProducts).toBe(20);
  // });

  // // Check to make sure that all 20 <product-item> elements have data in them
  // it('Make sure <product-item> elements are populated', async () => {
  //   console.log('Checking to make sure <product-item> elements are populated...');
  //   // Start as true, if any don't have data, swap to false
  //   let allArePopulated = true;
  //   // Query select all of the <product-item> elements
  //   const prodItemsData = await page.$$eval('product-item', prodItems => {
  //     return prodItems.map(item => {
  //       // Grab all of the json data stored inside
  //       return data = item.data;
  //     });
  //   });
  //   console.log(`Checking product item 1/${prodItemsData.length}`);
  //   // Make sure the title, price, and image are populated in the JSON
  //   firstValue = prodItemsData[0];
  //   if (firstValue.title.length == 0) { allArePopulated = false; }
  //   if (firstValue.price.length == 0) { allArePopulated = false; }
  //   if (firstValue.image.length == 0) { allArePopulated = false; }
  //   // Expect allArePopulated to still be true
  //   expect(allArePopulated).toBe(true);

  //   // TODO - Step 1
  //   // Right now this function is only checking the first <product-item> it found, make it so that
  //   // it checks every <product-item> it found
  //   for (let i = 0; i < prodItemsData.length; i++) {
  //     console.log(`Checking product item ${i + 1}/${prodItemsData.length}`);
  //     const currentItem = prodItemsData[i];
  //     if (currentItem.title.length === 0 || currentItem.price.length === 0 || currentItem.image.length === 0) {
  //       allArePopulated = false;
  //       break; // No need to continue checking once one item fails
  //     }
  //   }
  
  //   expect(allArePopulated).toBe(true);


  // }, 10000);

  // it('Make sure <product-item> elements are populated', async () => {
  //   const allArePopulated = await page.$$eval('product-item', prodItems => {
  //     return prodItems.every(item => {
  //       const data = item.data;
  //       return data && data.title && data.title.length > 0 && 
  //              data.price && data.price > 0 && 
  //              data.image && data.image.length > 0;
  //     });
  //   });
  //   expect(allArePopulated).toBe(true);
  // }, 10000);

  // // Check to make sure that when you click "Add to Cart" on the first <product-item> that
  // // the button swaps to "Remove from Cart"
  // it('Clicking the "Add to Cart" button should change button text', async () => {
  //   console.log('Checking the "Add to Cart" button...');
  //   // TODO - Step 2
  //   // Query a <product-item> element using puppeteer ( checkout page.$() and page.$$() in the docs )
  //   // Grab the shadowRoot of that element (it's a property), then query a button from that shadowRoot.
  //   // Once you have the button, you can click it and check the innerText property of the button.
  //   // Once you have the innerText property, use innerText.jsonValue() to get the text value of it
  //   const productItem = await page.$('product-item');
  //   const shadowRoot = await productItem.evaluateHandle(item => item.shadowRoot);
  //   const button = await shadowRoot.$('button');
  //   await button.click();
  //   //await page.waitFor(500);
  //   const buttonText = await button.evaluate(button => button.innerText);
  //   expect(buttonText.trim()).toBe('Remove from Cart');
  // }, 2500);

  // // Check to make sure that after clicking "Add to Cart" on every <product-item> that the Cart
  // // number in the top right has been correctly updated
  // it('Checking number of items in cart on screen', async () => {
  //   console.log('Checking number of items in cart on screen...');
  //   // TODO - Step 3
  //   // Query select all of the <product-item> elements, then for every single product element
  //   // get the shadowRoot and query select the button inside, and click on it.
  //   // Check to see if the innerText of #cart-count is 20
  //   const productItems = await page.$$('product-item');

  //   for (let i = 1; i < productItems.length; i++) {
  //     const shadowRoot = await productItems[i].evaluateHandle(item => item.shadowRoot);
  //     const button = await shadowRoot.$('button');
  //     await button.click();
  //   }

  //   const cartCount = await page.$eval('#cart-count', cartCountElement => cartCountElement.innerText);
  //   expect(cartCount).toBe('20');
  // }, 15000);

  // // Check to make sure that after you reload the page it remembers all of the items in your cart
  // it('Checking number of items in cart on screen after reload', async () => {
  //   console.log('Checking number of items in cart on screen after reload...');
  //   // TODO - Step 4
  //   // Reload the page, then select all of the <product-item> elements, and check every
  //   // element to make sure that all of their buttons say "Remove from Cart".
  //   // Also check to make sure that #cart-count is still 20
  //   await page.reload({ waitUntil: ['domcontentloaded', 'networkidle0'] });
  //   const productItems = await page.$$('product-item');
  //   for (const productItem of productItems) {
  //     const shadowRoot = await productItem.evaluateHandle(item => item.shadowRoot);
  //     const button = await shadowRoot.$('button');
  //     const buttonText = await button.evaluate(btn => btn.innerText);
  //     expect(buttonText.trim()).toBe('Remove from Cart');
  // }
  // const cartCount = await page.$eval('#cart-count', cartCountElement => cartCountElement.innerText);
  // expect(cartCount).toBe('20');

  // }, 10000);

  // // Check to make sure that the cart in localStorage is what you expect
  // it('Checking the localStorage to make sure cart is correct', async () => {
  //   // TODO - Step 5
  //   // At this point he item 'cart' in localStorage should be 
  //   // '[1,2,3,4,5,6,7,8,9,10,11,12,13,14,15,16,17,18,19,20]', check to make sure it is
  //   const cartValue = await page.evaluate(() => localStorage.getItem('cart'));

  //   const expectedCartValue = JSON.stringify(Array.from({ length: 20 }, (_, i) => i + 1));
  //   expect(cartValue).toBe(expectedCartValue);
  // });

  // // Checking to make sure that if you remove all of the items from the cart that the cart
  // // number in the top right of the screen is 0
  // it('Checking number of items in cart on screen after removing from cart', async () => {
  //   console.log('Checking number of items in cart on screen...');
  //   // TODO - Step 6
  //   // Go through and click "Remove from Cart" on every single <product-item>, just like above.
  //   // Once you have, check to make sure that #cart-count is now 0
  //   const productItems = await page.$$('product-item');

  //   for (const productItem of productItems) {
  //     const shadowRoot = await productItem.evaluateHandle(item => item.shadowRoot);
  
  //     // Find the button inside the shadow DOM for removing from cart
  //     const removeButton = await shadowRoot.$('button');
  
  //     // Click the remove button to remove the item from the cart
  //     await removeButton.click();
  //   }
  
  //   // Get the updated cart count
  //   const updatedCartCount = await page.$eval('#cart-count', element => parseInt(element.innerText));
  
  //   // Check if the cart count is now 0
  //   expect(updatedCartCount).toBe(0);
  // }, 10000);

  // // Checking to make sure that it remembers us removing everything from the cart
  // // after we refresh the page
  // it('Checking number of items in cart on screen after reload', async () => {
  //   console.log('Checking number of items in cart on screen after reload...');
  //   // TODO - Step 7
  //   // Reload the page once more, then go through each <product-item> to make sure that it has remembered nothing
  //   // is in the cart - do this by checking the text on the buttons so that they should say "Add to Cart".
  //   // Also check to make sure that #cart-count is still 0

  //   await page.reload({ waitUntil: ["networkidle0", "domcontentloaded"] });
  //   const productItems = await page.$$('product-item');
  //   for (const productItem of productItems) {
  //     const shadowRoot = await productItem.evaluateHandle(item => item.shadowRoot);
  //     const button = await shadowRoot.$('button');
  //     const buttonText = await button.evaluate(btn => btn.innerText);
  //     expect(buttonText.trim()).toBe('Add to Cart');
  // }
  //   // Get the cart counts
  //   const cartCount = await page.$eval('#cart-count', element => parseInt(element.innerText));
  
  //   // Check if the cart count is still 0
  //   expect(cartCount).toBe(0);
  // }, 10000);

  // // Checking to make sure that localStorage for the cart is as we'd expect for the
  // // cart being empty
  // it('Checking the localStorage to make sure cart is correct', async () => {
  //   console.log('Checking the localStorage...');
  //   // TODO - Step 8
  //   // At this point he item 'cart' in localStorage should be '[]', check to make sure it is
  //   const cartValue = await page.evaluate(() => localStorage.getItem('cart'));

  //   // Check if the retrieved cart value is an empty array
  //   expect(cartValue).toBe("[]");
  // });
});
