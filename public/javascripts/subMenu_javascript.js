document.addEventListener("DOMContentLoaded", () => {

  $("#submenuTable").DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: "/api/submenu/datatables", // Backend endpoint
      type: "GET",
      dataSrc: function (json) {
        console.log("DataTables response:", json); // Debugging log
        return json.data; // Extract the data array
      },
    },
    columns: [
      {
        data: "id_submenu",
        render: function (data, type, row) {
          console.log("Data ID:", row); // Debugging log
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-warning submenuEdit" data-id="${row.id_submenu}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger submenuDelete" data-id="${row.id_submenu}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        },
      },
      { data: "nama_submenu", title: "Nama Submenu" },
      { data: "link", title: "Link" },
      { data: "icon", title: "Icon" },
      { data: "urutan", title: "Urutan" },
      { data: "is_active", title: "Is Active" },
      { data: "id_menu", title: "ID Menu" }
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
  document.getElementById("submitSubmenuBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id_submenu").value;
    const nama_submenu = document.getElementById("nama_submenu").value;
    const link = document.getElementById("link").value;
    const icon = document.getElementById("icon").value;
    const id_menu = document.getElementById("id_menu").value;
    const urutan = document.getElementById("urutan").value;
    const is_active = document.getElementById("is_active").value;

  // Tentukan URL dan method berdasarkan id
  const isUpdate = id !== "";
  const url = isUpdate ? `/api/submenu/${id}` : `/api/submenu`;
  const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          nama_submenu,
          link,
          icon,
          urutan: parseInt(urutan),
          is_active,
          id_menu
        }),
      });

      const data = await res.json();

      if (res.ok) {
        swal("Berhasil!", data.message || "Submenu berhasil ditambahkan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

  // MENGISI VALUE FORM (EDIT)
  document.getElementById("submenuTable").addEventListener("click", async (e) => {
    if (e.target.closest(".submenuEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".submenuEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/submenu/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const submenu = data.data;

          document.getElementById("hidden_id_submenu").value = submenu.id_submenu;
          document.getElementById("nama_submenu").value = submenu.nama_submenu;
          document.getElementById("link").value = submenu.link;
          document.getElementById("icon").value = submenu.icon;
          document.getElementById("id_menu").value = submenu.id_menu;
          document.getElementById("is_active").value = submenu.is_active;
          document.getElementById("urutan").value = submenu.urutan;

          const modal = new bootstrap.Modal(document.getElementById("submenuModal"));
          modal.show();
        } else {
          swal("Gagal", "Submenu tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
    }
  });

  // RESET SAAT MENUTUP MODAL
  document.getElementById('submenuModal').addEventListener('hidden.bs.modal', function () {
      document.getElementById("submenuForm").reset();
      document.getElementById("hidden_id_submenu").value = '';
  });
    

  // DELETE
  document.getElementById("submenuTable").addEventListener("click", async (e) => {
    if (e.target.closest(".submenuDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".submenuDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/submenu/${id}`, {
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