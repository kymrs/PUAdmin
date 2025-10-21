document.addEventListener("DOMContentLoaded", () => {

  $("#menuTable").DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: "/api/menu/datatables", // Backend endpoint
      type: "GET",
      dataSrc: function (json) {
        // console.log("DataTables response:", json); // Debugging log
        return json.data; // Extract the data array
      },
    },
    columns: [
      {
        data: "id_menu",
        render: function (data, type, row) {

          // console.log("Data ID:", row); // Debugging log
          
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-warning menuEdit" data-id="${row.id_menu}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger menuDelete" data-id="${row.id_menu}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        },
      },
      { data: "nama_menu", title: "Nama Menu" },
      { data: "link", title: "Link" },
      { data: "icon", title: "Icon" },
      { data: "urutan", title: "Urutan" },
      { data: "is_active", title: "Is Active" },
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
  document.getElementById("submitMenuBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id_menu").value;
    const nama_menu = document.getElementById("nama_menu").value;
    const link = document.getElementById("link").value;
    const icon = document.getElementById("icon").value;
    const urutan = document.getElementById("urutan").value;
    const is_active = document.getElementById("is_active").value;

  // Tentukan URL dan method berdasarkan id
  const isUpdate = id !== "";
  const url = isUpdate ? `/api/menu/${id}` : `/api/menu`;
  const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_menu,
          link,
          icon,
          urutan: parseInt(urutan),
          is_active
        }),
      });

      const data = await res.json();

      if (res.ok) {
        swal("Berhasil!", data.message || "Menu berhasil ditambahkan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

  // MENGISI VALUE FORM (EDIT)
  document.getElementById("menuTable").addEventListener("click", async (e) => {
    if (e.target.closest(".menuEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".menuEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/menu/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const menu = data.data;

          document.getElementById("hidden_id_menu").value = menu.id_menu;
          document.getElementById("nama_menu").value = menu.nama_menu;
          document.getElementById("link").value = menu.link;
          document.getElementById("icon").value = menu.icon;
          document.getElementById("urutan").value = menu.urutan;
          document.getElementById("is_active").value = menu.is_active;

          const modal = new bootstrap.Modal(document.getElementById("menuModal"));
          modal.show();
        } else {
          swal("Gagal", "Menu tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
    }
  });

  // RESET SAAT MENUTUP MODAL
  document.getElementById('menuModal').addEventListener('hidden.bs.modal', function () {
      document.getElementById("menuForm").reset();
      document.getElementById("hidden_id_menu").value = '';
  });
    

  // DELETE
  document.getElementById("menuTable").addEventListener("click", async (e) => {
    if (e.target.closest(".menuDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".menuDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/menu/${id}`, {
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
});  