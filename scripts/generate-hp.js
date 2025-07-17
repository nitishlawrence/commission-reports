function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF('p', 'mm', 'a4');
    const form = document.getElementById('commissioningForm');

    const marginX = 15;

    // --- Logo ---
    doc.addImage('../assets/logo.png', 'PNG', marginX, 5, 40, 20);

    // Address block aligned right
    doc.setFontSize(7);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);

    const pageWidth = 210;
    const rightMargin = 15;
    const addressX = pageWidth - rightMargin;

    const addressLines = [
        '# 6, 29/1-B,',
        'Konanakunte Industrial Area,',
        'Amruthnagar Main Road,',
        'Harinagara Cross, Konanakunte,',
        'Bengaluru - 560 062.',
        'Phone: 99000 83176',
        'E-mail : sales@bisineer.com  •  services@bisineer.com'
    ];

    let addressY = 6;
    addressLines.forEach(line => {
        doc.text(line, addressX, addressY, { align: 'right' });
        addressY += 3;
    });

    const logoBottomY = 5 + 20;
    const addressBottomY = addressY;
    let y = Math.max(logoBottomY, addressBottomY) + 5;

    // --- Title ---
    y = 30;
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('RO System Commissioning Report', 105, y, { align: 'center' });
    y += 10;

    // --- CLIENT INFORMATION ---
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(40, 40, 40);
    doc.text('CLIENT INFORMATION', marginX, y);
    y += 5;

    doc.setDrawColor(180);
    doc.setFillColor(240, 248, 255);
    doc.rect(marginX, y, 180, 30, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Company/Client Name: ${form.companyName.value}`, marginX + 3, y + 6);
    doc.text(`Invoice No: ${form.invoiceNo.value}`, marginX + 90, y + 6);
    doc.text(`Signature person: ${form.customerName.value}`, marginX + 3, y + 12);
    doc.text(`Contact No: ${form.contactNo.value}`, marginX + 90, y + 12);
    doc.text(`Address: ${form.address.value}`, marginX + 3, y + 18);
    doc.text(`Commissioned by: ${form.commissionedBy.value}`, marginX + 3, y + 24);
    doc.text(`Commissioning Date: ${form.commissioningDate.value}`, marginX + 90, y + 24);

    y += 40;

    // --- PRODUCT DETAILS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('PRODUCT DETAILS', marginX, y);
    y += 5;

    doc.setDrawColor(180);
    doc.setFillColor(240, 248, 255);
    doc.rect(marginX, y, 180, 12, 'FD');

    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(`Model: ${form.model.value}`, marginX + 3, y + 8);
    doc.text(`Capacity: ${form.capacity.value}`, marginX + 65, y + 8);
    doc.text(`Serial No: ${form.serialNo.value}`, marginX + 130, y + 8);

    y += 20;

    // --- INSTALLATION CHECK LIST ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('INSTALLATION CHECK LIST', marginX, y);
    y += 5;

    const installationFields = [
        ['Plumbing Observation', form.plumbingObservation.value],
        ['Union & Valve (Inlet & Outlet)', form.Union.value],
        ['Tank Sensor', form.tankSensor.value],
        ['Vibration Damper', form.vibrationdamper.value],
        ['Drain Pipe', form.drainPipe.value]
    ];

    installationFields.forEach(([label, val]) => {
        doc.setFillColor(250, 255, 255);
        doc.rect(marginX, y, 180, 8, 'FD');
        doc.setDrawColor(220);
        doc.rect(marginX, y, 180, 8);
        doc.setFontSize(10);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(0, 0, 0);
        doc.text(`${label}: ${val}`, marginX + 3, y + 5);
        y += 9;
    });

    y += 5;

    // --- OPERATION CHECK LIST ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('OPERATION CHECK LIST', marginX, y);
    y += 5;

    const opFields = [
        ['Compressor Voltage / Current', form.compressorVoltage.value],
        ['Heat Pump Input Power', form.heatPumpPower.value],
        ['Standing pressure with Ambient Temperature', form.standingPressure.value]
    ];

    opFields.forEach(([label, val]) => {
        doc.setFillColor(245, 250, 255);
        doc.roundedRect(marginX, y, 180, 8, 2, 2, 'FD');
        doc.setDrawColor(220);
        doc.text(`${label}: ${val}`, marginX + 3, y + 5);
        y += 10;
    });

    y += 5;

    // --- OBSERVATIONS ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('OBSERVATIONS AND RECOMMENDATIONS', marginX, y);
    y += 5;

    doc.setFillColor(250, 250, 255);
    doc.setDrawColor(200);
    doc.rect(marginX, y, 180, 20, 'FD');
    const obsText = doc.splitTextToSize(form.observations.value || 'None', 175);
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(0, 0, 0);
    doc.text(obsText, marginX + 3, y + 6);

    y += 30;

    // --- SIGNATURES ---
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.setTextColor(40, 40, 40);
    doc.text('SIGNATURES', marginX, y);
    y += 5;

    const customerCanvas = document.getElementById('customerSignature');
    const engineerCanvas = document.getElementById('engineerSignature');

    html2canvas(customerCanvas).then(canvas => {
        const customerImg = canvas.toDataURL('image/png');
        doc.addImage(customerImg, 'PNG', marginX + 2, y, 70, 20);
        doc.setFontSize(10);
        doc.setTextColor(0, 0, 0);
        doc.text('Customer/Representative', marginX + 2, y + 25);

        html2canvas(engineerCanvas).then(canvas => {
            const engineerImg = canvas.toDataURL('image/png');
            doc.addImage(engineerImg, 'PNG', marginX + 100, y, 70, 20);
            doc.text('Service Engineer', marginX + 100, y + 25);

            doc.setFontSize(8);
            doc.setTextColor(120);
            doc.text('Thank you for choosing Bisineer.', 105, 290, { align: 'center' });
            doc.text('www.bisineer.com', 105, 295, { align: 'center' });

            doc.save(`RO_Commissioning_${form.invoiceNo.value}.pdf`);
            enableNextButton();
        });
    });
}

function enableNextButton() {
    const btn = document.getElementById('nextButton');
    if (btn) btn.disabled = false;
}
function enableNextButton() {
  const nextBtn = document.getElementById('nextButton');
  nextBtn.disabled = false;
  nextBtn.onclick = function () {
    const form = document.getElementById('commissioningForm');
    const params = new URLSearchParams();
    params.append('entry.2050442874', form.companyName.value);
    params.append('entry.2140617314', form.invoiceNo.value);
    window.location.href = `https://docs.google.com/forms/d/e/1FAIpQLSesDslPfVRM9env0JJo91s5Qf9jWZIsdrEjiHXLHdZBLygsag/viewform?usp=pp_url&${params.toString()}`;
  };
} 
