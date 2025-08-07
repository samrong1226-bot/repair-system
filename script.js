document.addEventListener("DOMContentLoaded", function () {
  // Set current datetime
  const now = new Date();
  document.getElementById("datetime").value = now.toLocaleString("th-TH", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  });

  // Load machine list based on location
  document.getElementById("location").addEventListener("change", function () {
    const loc = this.value;
    const machineGroup = document.getElementById("machineGroup");
    const otherGroup = document.getElementById("otherLocationGroup");

    if (loc === "other") {
      machineGroup.style.display = "none";
      otherGroup.style.display = "block";
    } else {
      otherGroup.style.display = "none";
      if (loc) {
        machineGroup.style.display = "block";
        loadMachines(loc);
      } else {
        machineGroup.style.display = "none";
      }
    }
  });

  // Form submission
  document.getElementById("repairForm").addEventListener("submit", function (e) {
    e.preventDefault();
    
    // Validation
    const reporter = document.getElementById("reporter").value.trim();
    const jobType = document.getElementById("jobType").value;
    const location = document.getElementById("location").value;
    const otherLocation = document.getElementById("otherLocation").value;
    
    if (!reporter) {
      alert("กรุณาระบุชื่อผู้แจ้ง!");
      document.getElementById("reporter").focus();
      return;
    }
    
    if (!jobType) {
      alert("กรุณาเลือกประเภทงาน!");
      document.getElementById("jobType").focus();
      return;
    }
    
    if (!location) {
      alert("กรุณาเลือกสถานที่!");
      document.getElementById("location").focus();
      return;
    }
    
    if (location === "other" && !otherLocation.trim()) {
      alert("กรุณาระบุจุดที่แจ้งซ่อม!");
      document.getElementById("otherLocation").focus();
      return;
    }
    
    // รวบรวมข้อมูล
    const formData = {
      datetime: document.getElementById("datetime").value,
      jobType: document.getElementById("jobType").value,
      location: document.getElementById("location").value,
      machine: document.getElementById("machine").value,
      otherLocation: document.getElementById("otherLocation").value,
      problem: document.getElementById("problem").value,
      note: document.getElementById("note").value,
      reporter: document.getElementById("reporter").value
    };
    
    // ส่งข้อมูลไป Backend
    sendToGoogleSheet(formData);
  });
});

function loadMachines(location) {
  // Mock data - ในอนาคตจะดึงจาก Google Sheet จริง
  const machines = {
    "Line 1": ["เครื่องอัด成型 A1", "เครื่องตัด B1", "เครื่องตรวจสอบ C1"],
    "Line 2": ["เครื่องหลอม D2", "เครื่องขึ้นรูป E2", "เครื่องบรรจุ F2"],
    "Line 3": ["เครื่องพ่นสี G3", "เครื่องอบ H3", "เครื่องตรวจสอบคุณภาพ I3"],
    "Line 4": ["เครื่องขึ้นรูป J4", "เครื่องตัด K4", "เครื่องตรวจสอบ L4"],
    "Line 5": ["เครื่องหลอม M5", "เครื่องอัด成型 N5", "เครื่องตรวจสอบ O5"],
    "Line 6": ["เครื่องพ่นสี P6", "เครื่องอบ Q6", "เครื่องบรรจุ R6"],
    "Line 7": ["เครื่องอัด成型 S7", "เครื่องตัด T7", "เครื่องตรวจสอบ U7"],
    "Line 8": ["เครื่องหลอม V8", "เครื่องขึ้นรูป W8", "เครื่องตรวจสอบ X8"],
    "Line 9": ["เครื่องพ่นสี Y9", "เครื่องอบ Z9", "เครื่องบรรจุ A9"],
    "Line 10": ["เครื่องอัด成型 B10", "เครื่องตัด C10", "เครื่องตรวจสอบ D10"],
    "Line 11": ["เครื่องหลอม E11", "เครื่องขึ้นรูป F11", "เครื่องตรวจสอบ G11"],
    "Line 12": ["เครื่องพ่นสี H12", "เครื่องอบ I12", "เครื่องบรรจุ J12"]
  };

  const select = document.getElementById("machine");
  select.innerHTML = '<option value="">เลือกเครื่องจักร</option>';
  
  if (machines[location]) {
    machines[location].forEach(m => {
      const opt = document.createElement("option");
      opt.value = m;
      opt.text = m;
      select.appendChild(opt);
    });
  }
}

function sendToGoogleSheet(data) {
  // แสดง loading
  const submitBtn = document.querySelector('button[type="submit"]');
  const originalText = submitBtn.innerHTML;
  submitBtn.innerHTML = '<i class="bi bi-arrow-repeat spin"></i> กำลังส่งข้อมูล...';
  submitBtn.disabled = true;

  fetch("https://script.google.com/macros/s/AKfycbxJpYHkMOk0gyK2WsdfDvMxH9liesOQlFw6fvWxlK1owb7W2EnzDXF-cpIbBjL91KCohg/exec", {
    method: "POST",
    body: JSON.stringify(data),
    headers: {
      "Content-Type": "application/json"
    }
  })
  .then(response => {
    if (!response.ok) {
      throw new Error('Network response was not ok');
    }
    return response.json();
  })
  .then(result => {
    if (result.error) {
      throw new Error(result.error);
    }
    
    // แสดงผลสำเร็จ
    alert("✅ ส่งข้อมูลสำเร็จ!\nเลขที่แจ้งซ่อม: " + result.repairID);
    
    // รีเซ็ตฟอร์ม
    document.getElementById("repairForm").reset();
    document.getElementById("machineGroup").style.display = "none";
    document.getElementById("otherLocationGroup").style.display = "none";
  })
  .catch(error => {
    console.error("Error:", error);
    alert("❌ เกิดข้อผิดพลาดในการส่งข้อมูล:\n" + error.message);
  })
  .finally(() => {
    // คืนค่าปุ่ม
    submitBtn.innerHTML = originalText;
    submitBtn.disabled = false;
  });
}

// เพิ่ม CSS สำหรับ animation
const style = document.createElement('style');
style.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
  .spin {
    animation: spin 1s linear infinite;
  }
`;
document.head.appendChild(style);
