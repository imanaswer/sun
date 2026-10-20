import type { ShopPolicy, ShopPolicyHandle } from "@/lib/shopify";

/**
 * Policies whose wording the business supplied directly (Website changes deck,
 * Oct 2026). They win over the Shopify admin copy, so edit them HERE — and
 * paste the same text into Shopify Admin → Settings → Policies, because
 * checkout links to Shopify's own copy.
 */

const SHIPPING_POLICY = `<p>At <strong>Sun Umbrella Private Limited</strong>, we are committed to delivering your orders safely and efficiently. This Shipping Policy outlines how we process, ship, and deliver products purchased from our website.</p>
<h2>Shipping Coverage</h2>
<p>We currently ship our products <strong>across India</strong> through reliable courier and logistics partners to ensure timely and secure delivery.</p>
<h2>Order Processing Time</h2>
<p>All orders placed on our website are typically processed within <strong>1–2 business days</strong> after payment confirmation.</p>
<p>Orders placed on <strong>weekends or public holidays</strong> will be processed on the next working day.</p>
<p>Once the order is processed, it will be handed over to our shipping partners for delivery.</p>
<h2>Estimated Delivery Time</h2>
<p>Delivery timelines depend on the destination and courier partner availability.</p>
<ul>
<li><strong>Metro Cities:</strong> 3–5 business days</li>
<li><strong>Other Cities &amp; Towns:</strong> 5–7 business days</li>
<li><strong>Remote Locations:</strong> 7–10 business days</li>
</ul>
<p>Please note that these timelines are <strong>estimated delivery times</strong> and may vary due to factors beyond our control.</p>
<h2>Shipping Charges</h2>
<p>Shipping is normally <strong>free on all standard orders</strong>. In special circumstances where shipping charges apply (depending on delivery location, order value, or product size/weight), the exact applicable charge will be clearly displayed at checkout before you complete your order.</p>
<ul>
<li><strong>Delivery Location:</strong> Special delivery rates may apply for specific remote regions or non-standard destinations.</li>
<li><strong>Order Value &amp; Product Size:</strong> Oversized items or bulk orders may incur custom freight handling.</li>
<li><strong>Transparent Checkout:</strong> You will always see the exact shipping cost before making payment.</li>
</ul>
<h2>Order Tracking</h2>
<p>Once your order has been shipped, you will receive a <strong>shipping confirmation email or message</strong> with the <strong>tracking number</strong> and courier details.</p>
<p>This allows you to monitor the delivery status of your order.</p>
<h2>Delivery Address</h2>
<p>Customers are responsible for providing <strong>accurate and complete delivery information</strong>, including:</p>
<ul>
<li>Full address</li>
<li>PIN code</li>
<li>Contact number</li>
</ul>
<p>Sun Umbrella Private Limited will not be responsible for delays or failed deliveries caused by incorrect or incomplete address details.</p>
<h2>Delivery Attempts</h2>
<p>Our courier partners typically make <strong>2–3 delivery attempts</strong>. If the package cannot be delivered due to customer unavailability or incorrect details, it may be returned to us.</p>
<h2>Delivery Delays</h2>
<p>Delivery may occasionally be delayed due to circumstances beyond our control, such as:</p>
<ul>
<li>Weather conditions</li>
<li>Natural disasters</li>
<li>Government restrictions</li>
<li>Courier service delays</li>
<li>High seasonal demand</li>
</ul>
<p>We appreciate your patience and understanding in such situations.</p>
<h2>Contact Us</h2>
<p>If you have any questions regarding shipping or delivery status, please contact us through the Contact Us page on our website.</p>`;

const ADDRESS = `M/S. Sun Umbrella Pvt. Ltd.<br>211, Ground Floor, JCK Industrial Park, Phase–2,<br>Belagola Industrial Area, Mysuru – 570 016, Karnataka.`;

const RETURN_POLICY = `<p>At <strong>Sun Umbrella Private Limited</strong>, we aim to provide high-quality products and a smooth shopping experience. If you are not fully satisfied with your purchase, please review our policy below.</p>
<h2>1. General Return Shipping Terms</h2>
<ul>
<li><strong>Customer Returns (Change of Mind / Unsatisfied):</strong> In cases where the customer wishes to return a product due to personal preference or dissatisfaction, all return shipping charges must be borne entirely by the customer.</li>
<li><strong>Manufacturing Defects:</strong> Only in cases where a genuine manufacturing defect is present—which the company reserves the right to evaluate and determine—Sun Umbrella Private Limited will arrange for a reverse pickup or issue a replacement as per the company’s decision.</li>
</ul>
<h2>2. Return Eligibility Criteria</h2>
<p>Products are eligible for return strictly under the following conditions:</p>
<ul>
<li>The return request is raised within <strong>7 days from the date of delivery</strong>.</li>
<li>The product is completely unused, undamaged, and in its original packaging.</li>
<li>All original tags, brand labels, accessories, and invoices are fully intact.</li>
<li>The item shows no signs of post-delivery use, alteration, or handling damage.</li>
</ul>
<p><strong>Note:</strong> Returns that do not strictly comply with these conditions will not be accepted.</p>
<h2>3. Non-Returnable Items</h2>
<p>The following items are strictly non-eligible for returns or refunds:</p>
<ul>
<li>Products damaged due to customer misuse, improper storage, or accidental damage.</li>
<li>Items returned without original tags, invoices, or packaging.</li>
<li>Products displaying signs of personal use, wear and tear, or alteration.</li>
</ul>
<h2>4. Step-by-Step Return Process</h2>
<ol>
<li><strong>Initiate Request:</strong> Send an email to <a href="mailto:info@sunumbrellas.in">info@sunumbrellas.in</a> or reach out through our website's Contact Us page with your:
<ul>
<li>Order Number</li>
<li>Product Name</li>
<li>Reason for Return</li>
<li>Supporting Images / Videos (Mandatory if claiming damage or manufacturing defect)</li>
</ul></li>
<li><strong>Approval &amp; Instructions:</strong> Once evaluated and approved, our support team will reply via email with authorization and instructions.</li>
<li><strong>Dispatch to Return Address:</strong> For non-defective returns, ship the product back via courier at your own expense to our official return facility.</li>
</ol>
<p><strong>Official Return Shipping Address:</strong><br>${ADDRESS}</p>
<h2>5. Date of Return Receipt</h2>
<p>The ‘date of return receipt’ is strictly defined as the exact date on which the returned shipment is delivered to Sun Umbrella Private Limited premises at our Mysuru facility, as officially logged by the courier service tracking record.</p>
<h2>6. Inspection &amp; Refund Process</h2>
<ul>
<li><strong>Inspection:</strong> Every returned product undergoes quality verification upon arrival at our facility.</li>
<li><strong>Processing Time:</strong> Approved refunds will be processed within <strong>7–10 business days</strong>.</li>
<li><strong>Refund Value:</strong> The refund amount will be limited strictly to the net amount paid for the product at the time of purchase on the website.</li>
<li><strong>Method:</strong> All refunds will be credited directly to the original payment method used during checkout.</li>
</ul>
<h2>7. Reporting Damaged or Defective Goods</h2>
<p>If you receive a damaged, defective, or incorrect product, please notify us <strong>within 48 hours of delivery</strong> by emailing <a href="mailto:info@sunumbrellas.in">info@sunumbrellas.in</a> or calling <a href="tel:+918212514578">+91 821 2514578</a> / <a href="tel:+916364913526">+91 63649 13526</a> with supporting unboxing photos and videos. Our team will inspect the claim and arrange a reverse pickup or replacement upon confirming a manufacturing defect.</p>
<h2>8. Contact Us</h2>
<p>For any questions regarding our Return &amp; Exchange Policy, please reach out to our team:</p>
<p><strong>Email:</strong> <a href="mailto:info@sunumbrellas.in">info@sunumbrellas.in</a><br><strong>Phone / Customer Support:</strong> <a href="tel:+918212514578">+91 821 2514578</a> | <a href="tel:+916364913526">+91 63649 13526</a></p>
<p><strong>Postal &amp; Facility Address:</strong><br>${ADDRESS}</p>`;

export const POLICY_OVERRIDES: Partial<Record<ShopPolicyHandle, ShopPolicy>> = {
  "shipping-policy": { handle: "shipping-policy", title: "Shipping Policy & Charges", body: SHIPPING_POLICY },
  "refund-policy": { handle: "refund-policy", title: "Return & Exchange Policy", body: RETURN_POLICY },
};
