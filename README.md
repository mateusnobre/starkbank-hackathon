# starkbank-hackathon

## Description

Our project is named DivPix. The solution allows StarkInfra customers (specially Fintechs) to offer split payments through Pix to their customer base, charging interest on these payments, and taking the credit risk for themselves.

### Aspects of the solution

Our product does not want to take credit risk to Stark Infra, we just want to allow our clients to emit credit to their customer bases.

Here is what our solution is comprised of:
* API of split payments through Pix comprising of the following routes:
  * ROUTES
* Checkout Page for customers of our customers, in order to alleviate front-end development (similar to what Stripe offers to its customers)
* StarkInfra Marketplace Page (Where our PixParcelado app will be placed for our customers to add to their StarkInfra workspace)
* PixParcelado Dashboard -> Where the client can see the health of their credit wallet.

### Target Market

Fintechs know well their customer's financials to provide credit to them at lower interest rates than other financial institutions.

### Business Value

* Providing one more payment method focused on customers that do not have access to traditional debt (credit cards), with slower fees

* Example Customer Case: 
  * Assuming a company with 100M USD in transactions per year
  * Assuming the interest revenue will be used only for offsetting losses due to non-payment, it yields 0 USD in net additional revenue
  * If we manage to reduce the transaction fees in 1% by adding the PixParcelado option, that is an additional 1M USD in net profit.
* This works for both B2B and B2C transactions, the difference being the credit policies implemented in the two cases and the client's needs.

## Market-fit and economic viability

## Technologies

* Frontend: React.js;
* Backend: Django;

## Our Architecture


