$(document).ready(function() {

  $("#userTable").DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: "/api/user/datatables", // Backend endpoint
      type: "GET",
      dataSrc: function (json) {
        // console.log("DataTables response:", json); // Debugging log
        return json.data; // Extract the data array
      },
    },
    columns: [
      {
        data: "id",
        render: function (data, type, row) {
          // console.log("Data ID:", row); // Debugging log
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-info userApproval" data-id="${row.id}">
                <i class="fa fa-check"></i>
              </a>
              <a href="#" class="btn btn-sm btn-warning userEdit" data-id="${row.id}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger userDelete" data-id="${row.id}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        },
      },
      { data: "fullname", title: "Nama Lengkap" },
      { data: "username", title: "Username" },
      { data: "level.nama_level",
        title: "ID Level",
        render: function (data, type, row) {
          if (!data) return '';
          return data.charAt(0).toUpperCase() + data.slice(1);
        }
      },
      { data: "is_active", 
        title: "Status",
        render: function (data, type, row) {
          if (data === 'Y') {
            return '<span class="badge bg-success">Active</span>';
          } else if (data === 'N') {
            return '<span class="badge bg-secondary">Unvalidated</span>';
          } else {
            return '<span class="badge bg-warning">Unknown</span>';
          }
        }
      },
    ],
    columnDefs: [
      // { responsivePriority: 1, targets: 0 }, // Title
      // { responsivePriority: 2, targets: 1 }, // Image URL
      // { responsivePriority: 3, targets: 5 },  // Action
      // { targets: 0, width: '20%' }, // Set width for the first column (Title)
      // { targets: 1, width: '15%' }, // Set width for the second column (Image URL)
      // { targets: 2, width: '25%' }, // Set width for the third column (Description)
      // { targets: 3, width: '40%' }, // Set width for the fourth column (Category ID)
      // { targets: 4, width: '15%' }, // Set width for the fifth column (Created At)
      // { targets: 5, width: '30%' }  // Set width for the sixth column (Action)
    ],
    drawCallback: function () {
      // Force redraw untuk sync header & body
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    },
  });

    // CREATE OR UPDATE
    document.getElementById("submitUserBtn").addEventListener("click", async () => {
      const id = document.getElementById("hidden_id_user").value;
      const fullname = document.getElementById("fullname").value;
      const username = document.getElementById("username").value;
      const password = document.getElementById("password").value;
      const id_level = document.getElementById("id_level").value;
      const is_active = document.getElementById("is_active").value;
      const app = document.getElementById("app").value;
  
    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/user/${id}` : `/api/user`;
    const method = isUpdate ? "PUT" : "POST";

    const body = {
      fullname,
      username,
      id_level: parseInt(id_level),
      is_active,
      app
    };

    if (!isUpdate) {
      body.password = password; // Hanya kirim password saat update
    }

      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          swal("Berhasil!", data.message || "User berhasil ditambahkan", "success");
          setTimeout(() => location.reload(), 1500);
        } else {
          swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
        }
      } catch (err) {
        swal("Error!", "Gagal menghubungi server", "error");
      }
    });

    document.getElementById("addUserBtn").addEventListener("click", () => {
      document.getElementById("userForm").reset(); // Reset form
      document.getElementById("password").style.display = "block"; // Tampilkan password field
      document.getElementById("passwordDiv").style.display = "block"; // Tampilkan password field
    });

      // MENGISI VALUE FORM (EDIT)
    document.getElementById("userTable").addEventListener("click", async (e) => {
      if (e.target.closest(".userEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".userEdit");
      const id = btn.getAttribute("data-id");
    
      try {
        const res = await fetch(`/api/user/${id}`);
        const data = await res.json();
        console.log(data);
        document.getElementById("password").style.display = "none";
        document.getElementById("passwordDiv").style.display = "none"; // Sembunyikan password field
    
        if (data.status === "success") {
        const user = data.data;
    
        document.getElementById("hidden_id_user").value = user.id;
        document.getElementById("fullname").value = user.fullname;
        document.getElementById("username").value = user.username;
        document.getElementById("id_level").value = user.id_level;
        document.getElementById("is_active").value = user.is_active;
        document.getElementById("app").value = user.app;
    
        const modal = new bootstrap.Modal(document.getElementById("userFormModal"));
        modal.show();
        } else {
        swal("Gagal", "User tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
      }
    });

    // RESET SAAT MENUTUP MODAL
    document.getElementById('userFormModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById("userForm").reset();
        document.getElementById("hidden_id_user").value = '';
    });

    // DELETE
    document.getElementById("userTable").addEventListener("click", async (e) => {
      if (e.target.closest(".userDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".userDelete");
      const id = btn.getAttribute("data-id");
    
      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
        try {
          const res = await fetch(`/api/user/${id}`, {
          method: "DELETE",
          });
    
          const data = await res.json();
    
          if (data.status === "success") {
          swal({
            icon: "success",
            title: "Terhapus!",
            text: data.message,
            timer: 1500,
            buttons: false,
          }).then(() => {
            location.reload();
          });
          } else {
          swal("Gagal!", data.message || "Terjadi kesalahan", "error");
          }
        } catch (err) {
          swal("Error!", "Gagal menghubungi server", "error");
        }
        }
      });
      }
    });


    // APPROVAL USER
    document.getElementById("userTable").addEventListener("click", async (e) => {
      if (e.target.closest(".userApproval")) {
      e.preventDefault();
      const btn = e.target.closest(".userApproval");
      const id = btn.getAttribute("data-id");
    
      swal({
        title: "Apakah anda mau menyetujui pengguna ini?",
        icon: "warning",
        buttons: ["Batal", "Ya!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
        try {
          const res = await fetch(`/api/user/${id}/approve`, {
          method: "PUT",
          });
    
          const data = await res.json();
    
          if (data.status === "success") {
          swal({
            icon: "success",
            title: "Disetujui!",
            text: data.message,
            timer: 1500,
            buttons: false,
          }).then(() => {
            location.reload();
          });
          } else {
          swal("Gagal!", data.message || "Terjadi kesalahan", "error");
          }
        } catch (err) {
          swal("Error!", "Gagal menghubungi server", "error");
        }
        }
      });
      }
    });

});