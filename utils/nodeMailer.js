const nodemailer = require("nodemailer");
const Admin = require("./../model/adminModel");

module.exports = (ticket) => {
  const htmlContent = `
  <html>
    <head>
      <style>
        body {
          font-family: Arial, sans-serif;
          margin: 0;
          padding: 20px;
          background-color: #f4f4f4;
        }
        .container {
          background-color: #ffffff;
          border-radius: 8px;
          padding: 20px;
          box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
          max-width: 800px;
          margin: auto;
        }
        .container-header {
    display: flex;
    align-items: center;  
    justify-content: space-between;  
    background-color: #f4f4f4; 
    padding: 20px 30px; 
    border-radius: 8px; 
  }

  .container-header img {
    height: 40px;  
    margin-right: 15px; 
  }

  .container-header h1 {
    font-size: 24px;  
    font-weight: bold;  
    text-align: center; 
    flex-grow: 1; 
    margin: 0; 
  }
        p {
          font-size: 14px;
          color: #555;
          line-height: 1.6;
        }
        .strong {
          font-weight: bold;
        }
        .ticket-details {
          background-color: #f9f9f9;
          padding: 15px;
          margin: 20px 0;
          border-radius: 6px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
        }
        .ticket-details p {
          margin: 5px 0;
        }
        .images-container {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          justify-content: center;
        }
        .images-container img {
          max-width: 300px;
          height: auto;
          border-radius: 8px;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
      </style>
    </head>
    <body>
      <div class="container">
      <div class="container-header">
      <img src="https://admin-ticketing.cellpay.com.np/assets/logo/logo.svg" alt="cellpay logo" />
        <h1>Ticket Information</h1>
      </div>
        <div class="ticket-details">
          <p><span class="strong">Name:</span> ${ticket.name}</p>
          <p><span class="strong">Username:</span> ${ticket.username}</p>
          <p><span class="strong">Mobile No:</span> ${ticket.mobileNo}</p>
          <p><span class="strong">Category:</span> ${ticket.category}</p>
          <p><span class="strong">Topic:</span> ${ticket.topic}</p>
          <p><span class="strong">Description:</span> ${ticket.description}</p>
          <p><span class="strong">Status:</span> ${ticket.status}</p>
          <p><span class="strong">Ticket ID:</span> ${ticket._id}</p>
          <p><span class="strong">Created At:</span> ${ticket.createdAt}</p>
          <p><span class="strong">Updated At:</span> ${ticket.updatedAt}</p>
            <p><span class="strong">Images:</span></p>
        </div>
        
        <div class="images-container">
          ${
            ticket.imageUrls && ticket.imageUrls.length > 0
              ? ticket.imageUrls
                  .map((url) => `<img src="${url}" alt="Ticket Image">`)
                  .join("")
              : "<p>No images available</p>"
          }
        </div>
      </div>
    </body>
  </html>
`;

  const transporter = nodemailer.createTransport({
    host: "smtp.office365.com",
    port: 587,
    auth: {
      user: process.env.EMAIL_USERNAME,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  async function main() {
    try {
      const users = await Admin.find({
        sendEmail: true,
        role: { $ne: "super-admin" },
      }).select("email");
      const emails = users
        .filter((user) => user.email !== undefined)
        .map((user) => user.email);

      const info = await transporter.sendMail({
        from: '"Nabaraj 👻"<no-reply@cellcom.net.np>',
        to: `${emails.join(", ")}`,
        subject: "New Ticket Issued",
        html: htmlContent,
      });
    } catch (error) {
      console.error("Error sending email:", error);
    }
  }

  main();
};
