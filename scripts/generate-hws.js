function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const form = document.getElementById('commissioningForm');
    
    // Add logo and title
    doc.addImage('../assets/logo.png', 'PNG', 15, 10, 40, 20);
    doc.setFontSize(16);
    doc.text('Hot Water System Commissioning Report', 105, 20, { align: 'center' });
    doc.setFontSize(10);
    doc.setTextColor(100);
    
    // Client Information
    doc.setFontSize(12);
    doc.setTextColor(0);
    doc.text('CLIENT INFORMATION', 15, 40);
    doc.setFontSize(10);
    
    doc.text(`Company/Client Name: ${form.companyName.value}`, 15, 50);
    doc.text(`Invoice No: ${form.invoiceNo.value}`, 105, 50);
    doc.text(`Signature person: ${form.customerName.value}`, 15, 56);
    doc.text(`Contact No: ${form.contactNo.value}`, 105, 56);
    doc.text(`Address: ${form.address.value}`, 15, 62);
    doc.text(`Commissioned by: ${form.commissionedBy.value}`, 15, 68);
    doc.text(`Commissioning Date: ${form.commissioningDate.value}`, 105, 68);
    
    // Product Details
    doc.setFontSize(12);
    doc.text('PRODUCT DETAILS', 15, 80);
    doc.setFontSize(10);
    
    doc.text(`Model: ${form.model.value}`, 15, 86);
    doc.text(`Capacity: ${form.capacity.value}`, 75, 86);
    doc.text(`Serial No: ${form.serialNo.value}`, 135, 86);
    
    // Installation Check List
    doc.setFontSize(12);
    doc.text('INSTALLATION CHECK LIST', 15, 98);
    doc.setFontSize(10);
    
    const getRadioValue = (name) => {
        return document.querySelector(`input[name="${name}"]:checked`)?.value || 'Not specified';
    };
    
    doc.text(`PRV Installed: ${getRadioValue('prv')}`, 15, 104);
    doc.text(`AIR VENT Installed: ${getRadioValue('airVent')}`, 15, 110);
    doc.text(`Placements/positioning: ${getRadioValue('placement')}`, 15, 116);
    doc.text(`Plumbing as per Instructions: ${getRadioValue('plumbing')}`, 15, 122);
    doc.text(`Pipe Insulation: ${getRadioValue('insulation')}`, 15, 128);
    doc.text(`Any leakage observed: ${getRadioValue('leakage')}`, 15, 134);
    
    // Operation Check List
    doc.setFontSize(12);
    doc.text('OPERATION CHECK LIST', 15, 146);
    doc.setFontSize(10);
    
    doc.text(`Cold Water Pressure: ${form.waterPressure.value} bar`, 15, 152);
    doc.text(`Hardness of Water: ${form.waterHardness.value} ppm`, 15, 158);
    doc.text(`Hot Water Temperature: ${form.waterTemperature.value} °C`, 15, 164);
    
    // Observations
    doc.setFontSize(12);
    doc.text('OBSERVATIONS AND RECOMMENDATIONS', 15, 176);
    doc.setFontSize(10);
    
    const splitText = doc.splitTextToSize(form.observations.value || 'None', 180);
    doc.text(splitText, 15, 182);
    
    // Signatures
    doc.setFontSize(12);
    doc.text('SIGNATURES', 15, doc.internal.pageSize.height - 50);
    doc.setFontSize(10);
    
    // Convert canvas to image and add to PDF
    const customerCanvas = document.getElementById('customerSignature');
    const engineerCanvas = document.getElementById('engineerSignature');
    
    html2canvas(customerCanvas).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        doc.addImage(imgData, 'PNG', 15, doc.internal.pageSize.height - 45, 80, 40);
        doc.text('Customer/Representative', 15, doc.internal.pageSize.height - 5);
        
        html2canvas(engineerCanvas).then(canvas => {
            const imgData = canvas.toDataURL('image/png');
            doc.addImage(imgData, 'PNG', 115, doc.internal.pageSize.height - 45, 80, 40);
            doc.text('Service Engineer', 115, doc.internal.pageSize.height - 5);
            
            // Save the PDF
            doc.save(`HWS_Commissioning_${form.invoiceNo.value}.pdf`);
            enableNextButton();
        });
    });
}