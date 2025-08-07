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
      return;
    }
    
    if (!jobType) {
      alert("กรุณาเลือกประเภทงาน!");
      return;
    }
    
    if (!location) {
      alert("กรุณาเลือกสถานที่!");
      return;
    }
    
    if (location === "other" && !otherLocation.trim()) {
      alert("กรุณาระบุจุดที่แจ้งซ่อม!");
      document.getElementById("otherLocation").focus();
      return;
    }
    
    // ถ้าเลือกสถานที่แล้ว ให้เลือกเครื่องจักรด้วย (ถ้าไม่ใช่ other)
    if (location !== "other" && document.getElementById("machineGroup").style.display !== "none") {
      const machine = document.getElementById("machine").value;
      // ถ้าอยากให้บังคับเลือกเครื่องจักร ให้เปิด comment ด้านล่าง
      // if (!machine) {
      //   alert("กรุณาเลือกเครื่องจักร!");
      //   return;
      // }
    }
    
    alert("ระบบยังไม่ได้เชื่อมต่อกับ Google Sheet จริง\nในขั้นตอนนี้จะแสดงข้อมูลใน Console แทน");
    
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
    
    console.log("ข้อมูลที่จะส่ง:", formData);
    
    // ที่นี่จะเพิ่มการส่งข้อมูลไปยัง Google Apps Script
    // sendToGoogleSheet(formData);
  });
});

function loadMachines(location) {
  // Mock data สำหรับแต่ละ Line
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

// ฟังก์ชันสำหรับส่งข้อมูลไป Google Sheet (รอเชื่อมต่อ)
// function sendToGoogleSheet(data) {
//   fetch("https://script.google.com/macros/s/YOUR_SCRIPT_URL/exec", {
//     method: "POST",
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json"
//     }
//   })
//   .then(response => response.text())
//   .then(result => {
//     alert("ส่งข้อมูลสำเร็จ!");
//     document.getElementById("repairForm").reset();
//     document.getElementById("machineGroup").style.display = "none";
//     document.getElementById("otherLocationGroup").style.display = "none";
//   })
//   .catch(error => {
//     console.error("Error:", error);
//     alert("เกิดข้อผิดพลาดในการส่งข้อมูล");
//   });
// }
