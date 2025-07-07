function generatePDF() {
  const { jsPDF } = window.jspdf;
  const doc = new jsPDF('p', 'mm', 'a4');
  const form = document.getElementById('commissioningForm');
  const marginX = 15;
  const pageWidth = 210;

  // --- Logo ---
  doc.addImage('../assets/logo.png', 'PNG', marginX, 5, 40, 20);

  // Address Block Right Aligned
  doc.setFontSize(7);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(0, 0, 0);
  const addressX = pageWidth - 15;
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

  let y = Math.max(25, addressY) + 5;

  // --- Title ---
  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.text('Water Treatment Plant Commissioning Report', 105, y, { align: 'center' });
  y += 10;

  // --- Client Info ---
  doc.setFontSize(12);
  doc.text('CLIENT INFORMATION', marginX, y);
  y += 5;
  doc.setDrawColor(180);
  doc.setFillColor(240, 248, 255);
  doc.rect(marginX, y, 180, 30, 'FD');
  doc.setFontSize(10);
  doc.text(`Company: ${form.companyName.value}`, marginX + 3, y + 6);
  doc.text(`Invoice No: ${form.invoiceNo.value}`, marginX + 90, y + 6);
  doc.text(`Person: ${form.customerName.value}`, marginX + 3, y + 12);
  doc.text(`Contact: ${form.contactNo.value}`, marginX + 90, y + 12);
  doc.text(`Address: ${form.address.value}`, marginX + 3, y + 18);
  doc.text(`Commissioned by: ${form.commissionedBy.value}`, marginX + 3, y + 24);
  doc.text(`Date: ${form.commissioningDate.value}`, marginX + 90, y + 24);
  y += 40;

  // --- INSTALLATION CHECK LIST ---
  doc.setFontSize(12);
  doc.text('INSTALLATION CHECK LIST', marginX, y);
  y += 6;
  const installChecks = [
    ['Plumbing Observation', getRadioValue('plumbingObs')],
    ['Pump Plumbing', getRadioValue('pumpPlumbing')],
    ['Media Quantity', getRadioValue('mediaQuantity')],
    ['Air Vent & Pressure Gauge', getRadioValue('ventGauge')],
  ];
  installChecks.forEach(([label, value]) => {
    doc.setFontSize(10);
    doc.setFillColor(245, 250, 255);
    doc.rect(marginX, y, 180, 8, 'F');
    doc.setDrawColor(220);
    doc.rect(marginX, y, 180, 8);
    doc.text(label, marginX + 3, y + 5);
    doc.text(value, marginX + 130, y + 5);
    y += 9;
  });

  y += 5;

  // --- OPERATION CHECK LIST ---
  doc.setFontSize(12);
  doc.text('OPERATION CHECK LIST', marginX, y);
  y += 6;
  const opChecks = [
    ['Water Level Controller', getRadioValue('levelController')],
    ['Input Power Supply', getRadioValue('powerSupply')],
  ];
  opChecks.forEach(([label, value]) => {
    doc.setFontSize(10);
    doc.setFillColor(245, 250, 255);
    doc.rect(marginX, y, 180, 8, 'F');
    doc.setDrawColor(220);
    doc.rect(marginX, y, 180, 8);
    doc.text(label, marginX + 3, y + 5);
    doc.text(value, marginX + 130, y + 5);
    y += 9;
  });

  y += 5;

  // --- OBSERVATIONS ---
  doc.setFontSize(12);
  doc.text('OBSERVATIONS AND RECOMMENDATIONS', marginX, y);
  y += 6;
  doc.setFontSize(10);
  const obsText = doc.splitTextToSize(form.observations.value || 'None', 175);
  doc.setFillColor(250, 250, 255);
  doc.rect(marginX, y, 180, 20, 'F');
  doc.text(obsText, marginX + 3, y + 6);
  y += 26;

  // --- SIGNATURES ---
  doc.setFontSize(12);
  doc.text('SIGNATURES', marginX, y);
  y += 6;

  const customerCanvas = document.getElementById('customerSignature');
  const engineerCanvas = document.getElementById('engineerSignature');

  html2canvas(customerCanvas).then(canvas => {
    const customerImg = canvas.toDataURL('image/png');
    doc.addImage(customerImg, 'PNG', marginX, y, 70, 20);
    doc.setFontSize(10);
    doc.text('Customer/Representative', marginX, y + 25);

    html2canvas(engineerCanvas).then(canvas => {
      const engineerImg = canvas.toDataURL('image/png');
      doc.addImage(engineerImg, 'PNG', marginX + 100, y, 70, 20);
      doc.text('Service Engineer', marginX + 100, y + 25);

      doc.setFontSize(8);
      doc.setTextColor(120);
      doc.text('Thank you for choosing Bisineer.', 105, 290, { align: 'center' });
      doc.text('www.bisineer.com', 105, 295, { align: 'center' });

      doc.save(`WTP_Commissioning_${form.invoiceNo.value}.pdf`);
      enableNextButton();
    });
  });

  function getRadioValue(name) {
    return document.querySelector(`input[name="${name}"]:checked`)?.value || 'Not specified';
  }
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
