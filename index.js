// call back function
function hienThiThongBao(diem) {
  console.log(`Xin chúc mừng thí sinh đạt ${diem}`);
}

function tinhDiemTrungBinh(diemToan, diemVan, hienThiCauChao) {
  let diemTrungBinh = (diemToan + diemVan) / 2;
  hienThiCauChao(diemTrungBinh);
}

tinhDiemTrungBinh(3, 10, (diem) => {
  if (diem > 9) {
    console.log("quá giỏi");
  } else {
    console.log("quá kém");
  }
});

// Bất đồng bộ
// function lauNha() {
//   setTimeout(() => {
//     console.log("lau nhà");
//   }, 4000);
// }

// function nauCom() {
//   console.log("Nấu cơm");
// }

// lauNha();

// nauCom();

// Promise

// let promise = new Promise((resolve, reject) => {
//   let tong = 0 + 50 - 2;
//   setTimeout(() => {
//     if (tong > 60) {
//       resolve("Dữ liệu đã lấy về thành công");
//     } else {
//       reject("Dữ liệu lấy thất bại");
//     }
//   }, 4000);
// });

// promise
//   .then((resolve) => {
//     console.log(resolve);
//     // lấy dữ liệu và hiển thị lên giao diện
//   })
//   .catch((error) => {
//     console.log(error);
//   });

// async await (ES7)
// async function layKetQua() {
//   try {
//     // pending - fullied - reject
//     let result = await promise;
//     console.log(result);
//   } catch (error) {
//     console.log(error);
//   }
// }
// layKetQua();

// ---------- Tương tác lấy dữ liệu từ backend với Axios ------------------
// Lấy danh sách sinh viên
function layDanhSachSinhVien() {
  let promise = axios({
    // phương thức (method)
    method: "GET",
    // url (đường dẫn api)
    url: "https://svcy.myclass.vn/api/SinhVienApi/LayDanhSachSinhVien",
  });
  promise
    .then((res) => {
      console.log(res);
      renderSinhVienApi(res.data);
    })
    .catch((err) => {
      console.log(err);
      handleError("Có lỗi xảy ra vui lòng thử lại");
    });
  // 200 201
  // 400 404 403 401
  // 500
}

layDanhSachSinhVien();

// Chức năng hiển thị thông tin sinh viên lên table
function renderSinhVienApi(arr) {
  let content = "";
  arr.forEach((item, index) => {
    // destructuring
    let {
      maSinhVien,
      tenSinhVien,
      loaiSinhVien,
      diemToan,
      diemLy,
      diemHoa,
      diemRenLuyen,
      email,
      soDienThoai,
    } = item;

    let diemTrungBinh = (diemToan + diemHoa + diemLy + diemRenLuyen) / 4;
    content += `
      <tr>
        <td>${maSinhVien}</td>
        <td>${tenSinhVien}</td>
        <td>${email}</td>
        <td>${soDienThoai}</td>
        <td>${loaiSinhVien}</td>
        <td>${diemTrungBinh}</td>
        <td>
          <button class="btn btn-danger" onclick="deleteSinhVien(${maSinhVien})">Xoá</button>
          <button class="btn btn-warning" onclick="getInfoSinhVien(${maSinhVien})">Sửa</button>
        </td>
      </tr>
    `;
  });
  // gọi tới câu lệnh dom để thực hiện hiển thị lên giao diện
  document.getElementById("tableBody").innerHTML = content;
}

// Hiển thị thông báo lỗi cho người dùng
function handleError(text, duration = 3000) {
  Toastify({
    // text giúp thông báo lỗi: sử dụng cơ chế từ object literal (ES6)
    text,
    // thời gian diễn ra thông báo
    duration,
    close: true,
    gravity: "top", // `top` or `bottom`
    position: "right", // `left`, `center` or `right`
    stopOnFocus: true, // Prevents dismissing of toast on hover
    className: "bg-danger text-white",
  }).showToast();
}

// Chức năng thêm sinh viên
function addSinhVienApi(event) {
  event.preventDefault();
  // thực hiện truy cập tới tất cả input và select của form
  let arrField = document.querySelectorAll("#formQLSV input,#formQLSV select");
  let sinhVien = {};
  for (let field of arrField) {
    let { id, value } = field; // id = tenSinhVien
    sinhVien[id] = value;
  }
  console.log(sinhVien);
  // Gọi API từ BE để thêm một sinh viên lên CSDL
  let promise = axios({
    method: "POST",
    url: "https://svcy.myclass.vn/api/SinhVienApi/ThemSinhVien",
    data: sinhVien,
  });

  promise
    .then(function (res) {
      console.log(res);
      layDanhSachSinhVien();
      document.getElementById("formQLSV").reset();
    })
    .catch(function (err) {
      console.log(err);
      handleError(err.response.data);
    });
}

document.getElementById("formQLSV").onsubmit = addSinhVienApi;

// chức năng xoá
function deleteSinhVien(maSinhVien) {
  console.log(maSinhVien);
  let promise = axios({
    method: "DELETE",
    url: `https://svcy.myclass.vn/api/SinhVienApi/XoaSinhVien?maSinhVien=${maSinhVien}`,
  });
  promise
    .then(function (res) {
      console.log(res);
      layDanhSachSinhVien();
      handleError(res.data);
    })
    .catch(function (err) {
      console.log(err);
      handleError("Có lỗi xảy ra, vui lòng thử lại");
      layDanhSachSinhVien();
    });
}

// Lấy thông tin sinh viên
function getInfoSinhVien(maSinhVien) {
  console.log(maSinhVien);
  let promise = axios({
    method: "GET",
    url: `https://svcy.myclass.vn/api/SinhVienApi/LayThongTinSinhVien?maSinhVien=${maSinhVien}`,
  });
  promise
    .then((res) => {
      console.log(res);
      let sinhVien = res.data;
      // lệnh dom tương tác tới tất cả input và select trên giao diện
      let arrField = document.querySelectorAll(
        "#formQLSV input, #formQLSV select"
      );
      for (let field of arrField) {
        field.value = sinhVien[field.id];
      }
      // ngăn chặn chỉnh sửa mã sinh viên
      document.getElementById("maSinhVien").readOnly = true;
    })
    .catch((err) => {
      console.log(err);
    });
}

// cập nhật sinh viên
function updateSinhVien() {
  // lấy dữ liệu từ form
  let arrField = document.querySelectorAll("#formQLSV input,#formQLSV select");
  let sinhVien = {};
  for (let field of arrField) {
    let { id, value } = field; // id = tenSinhVien
    sinhVien[id] = value;
  }
  console.log(sinhVien);
  // sử dụng api cập nhật sinh viên để thay đổi dữ liệu
  let promise = axios({
    method: "PUT",
    url: `https://svcy.myclass.vn/api/SinhVienApi/CapNhatThongTinSinhVien?maSinhVien=${sinhVien.maSinhVien}`,
    data: sinhVien,
  });
  promise
    .then((res) => {
      console.log(res);
      layDanhSachSinhVien();
    })
    .catch((err) => {
      console.log(err);
      handleError("Có lỗi xảy ra, vui lòng thử lại sau");
      layDanhSachSinhVien();
    });
}
document.querySelector(".btn-primary").onclick = updateSinhVien;
