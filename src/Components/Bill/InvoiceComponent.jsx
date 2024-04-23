import React, { Component } from 'react';
import './InvoiceComponent.css';

export default class InvoiceComponent extends Component {
  render() {
    return (
      <div>
        <header>
          <h1> FACTURA </h1>
          <address>
            <p> Healthwise </p>
            <p> Sediu Cluj-Napoza</p>
            <p> Strada George Barițiu 24 </p>
            <p> +0789457891 </p>
          </address>

          <span>
            <img alt="MAHESH" src="https://logos.textgiraffe.com/logos/logo-name/Mahesh-designstyle-smoothie-m.png" className="rounded float-right align-top" />
          </span>
        </header>

        <body>
          <article>
            <address>
              <p> Detalii factura </p>
            </address>

            <table className="firstTable">
              <tr>
                <th><span >Factura #</span></th>
                <td><span >101138</span></td>
              </tr>
              <tr>
                <th><span >Date</span></th>
                <td><span >January 1, 2012</span></td>
              </tr>
              <tr>
                <th><span >Amount Due</span></th>
                <td><span id="prefix" >$</span><span>600.00</span></td>
              </tr>
            </table>

            <table className="secondTable">
              <thead>
                <tr>
                  <th><span >Item</span></th>
                  <th><span >Description</span></th>
                  <th><span >Rate</span></th>
                  <th><span >Quantity</span></th>
                  <th><span >Price</span></th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td><a class="cut">-</a><span >Front End Consultation</span></td>
                  <td><span >Experience Review</span></td>
                  <td><span data-prefix>$</span><span >150.00</span></td>
                  <td><span >4</span></td>
                  <td><span data-prefix>$</span><span>600.00</span></td>
                </tr>
              </tbody>
            </table>
            <table className="firstTable">
              <tr>
                <th><span >Total</span></th>
                <td><span data-prefix>$</span><span>600.00</span></td>
              </tr>
              <tr>
                <th><span >Amount Paid</span></th>
                <td><span data-prefix>$</span><span >0.00</span></td>
              </tr>
              <tr>
                <th><span >Balance Due</span></th>
                <td><span data-prefix>$</span><span>600.00</span></td>
              </tr>
            </table>
          </article>

          <aside>
            <h1 id="notes">Additional Notes</h1>
            <div >
              <p>A finance charge of 1.5% will be made on unpaid balances after 30 days.</p>
            </div>
          </aside>
        </body>
      </div>
    )
  }
}
