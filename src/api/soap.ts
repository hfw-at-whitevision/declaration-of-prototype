export async function makeSoapRequest(url, body) {
    const soapRequest = `
  <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:api="http://api.whitevision.nl/">
    <soapenv:Header/>
    <soapenv:Body>
      <api:RunOcr>
        <api:request>${JSON.stringify(body)}</api:request>
      </api:RunOcr>
    </soapenv:Body>
  </soapenv:Envelope>
  `;

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'text/xml; charset=utf-8',
            },
            body: soapRequest,
        });

        // Check if response is ok
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // Parse the XML response
        const responseText = await response.text();

        // You can parse the XML response here as needed
        console.log(responseText);

        return responseText;
    } catch (error) {
        console.error('Error making SOAP request:', error);
        throw error;
    }
}

// Example XML SOAP request
// const soapRequest = `
//     <soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:web="http://www.example.com/webservice">
//         <soapenv:Header/>
//         <soapenv:Body>
//             <web:YourSOAPRequest>
//                 <!-- Your SOAP request parameters here -->
//             </web:YourSOAPRequest>
//         </soapenv:Body>
//     </soapenv:Envelope>
// `;

// Call the function with your SOAP API URL and SOAP request XML
// makeSoapRequest(soapApiUrl, soapRequest)
//     .then(response => {
//         // Handle the response here
//     })
//     .catch(error => {
//         // Handle errors here
//     });
