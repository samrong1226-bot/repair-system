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
    
    // Simple validation
    const reporter = document.getElementById("reporter").value.trim();
    const jobType = document.getElementById("jobType").value;
    const location = document.getElementById("location").value;
    
    if (!reporter || !jobType || !location) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน!");
      return;
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
  });
});

function loadMachines(location) {
  // Mock data - ในอนาคตจะดึงจาก API
  const machines = {
    "Line 1": ["เครื่องอัด成型 A1", "เครื่องตัด B2", "เครื่องตรวจสอบ C3"],
    "Line 2": ["เครื่องหลอม D4", "เครื่องขึ้นรูป E5", "เครื่องบรรจุ F6"],
    "Line 3": ["เครื่องพ่นสี G7", "เครื่องอบ H8", "เครื่องตรวจสอบคุณภาพ I9"],
    "คลังสินค้า": ["รถยก J10", "คอนเวเยอร์ K11", "ระบบควบคุม L12"],
    "อาคารสำนักงาน": ["เครื่องปรับอากาศ M13", "ระบบไฟฟ้า N14", "ระบบ CCTV O15"]
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
