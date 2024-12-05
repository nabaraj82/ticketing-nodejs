const s3 = require('./../aws-config');
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const { GetObjectCommand } = require("@aws-sdk/client-s3");



// exports.getSignedUrlForTicket = async (ticket, s3) => {
//     const getObjectParams = {
//         Bucket: process.env.BUCKET_NAME,
//         Key: ticket.imageName,
//     }
    
//   const getCommand = new GetObjectCommand(getObjectParams);
//   const url = await getSignedUrl(s3, getCommand, { expiresIn: 3600 });
//     const responseTicket = { ...savedTicket.toObject(), imageURL: url };
    
//     return responseTicket
// }


module.exports= async (tickets) => {
    const ticketsWithUrls = await Promise.all(
        tickets.map(async (ticket) => {
            const getObjectParams = {
                Bucket: process.env.BUCKET_NAME,
                Key: ticket.imageName,
            };

            const getCommand = new GetObjectCommand(getObjectParams);

            const url = await getSignedUrl(s3, getCommand, { expiresIn: 36000 });

            return { ...ticket, imageURL: url }
        })
    );

    return ticketsWithUrls;
}