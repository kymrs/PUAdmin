document.addEventListener("DOMContentLoaded", () => {
  $('#umrahPackage').DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: '/api/umrahPackage/datatables', // Backend endpoint
      type: 'GET',
      dataSrc: function (json) {
        return json.data; // Extract the data array
      }
    },
    columns: [
            {
        data: 'id',
        render: function (data, type, row) {
          // console.log("Data ID:", row); // Debugging log
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-warning umrahPackageEdit" data-id="${row.id}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger umrahPackageDelete" data-id="${row.id}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        }
      },
      { data: 'name', title: 'Nama Paket' },
      { data: 'agency.name', title: 'Nama Travel' },
      { data: 'package_type', title: 'Tipe Paket' },
      { data: 'price', title: 'Harga' },
      { data: 'duration_days', title: 'Durasi' },
      { data: 'description', title: 'Deskripsi' },
      { data: 'created_at', title: 'Dibuat Pada' }
    ],
    drawCallback: function () {
      // Force redraw untuk sync header & body
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    },
    "columnDefs": [
      {
        "targets": [1,2,3],
        "className": 'dt-body-nowrap'
      }, {
        "targets": [0, 1],
        "orderable": false,
      },
      ]
  });

  // CREATE OR UPDATE
  document.getElementById("submitUmrahPackageBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id").value;
    const name = document.getElementById("name").value;
    const travel_agency_id = document.getElementById("travel_agency_id").value;
    const package_type = document.getElementById("package_type").value;
    const price = document.getElementById("price").value;
    const duration_days = document.getElementById("duration_days").value;
    const description = document.getElementById("description").value;

    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/umrahPackage/${id}` : `/api/umrahPackage`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          travel_agency_id,
          package_type,
          price,
          duration_days,
          description,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        swal("Berhasil!", data.message || "Travel berhasil ditambahkan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

  // MENGISI VALUE FORM (EDIT)
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".umrahPackageEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".umrahPackageEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/umrahPackage/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const packages = data.data;

          document.getElementById("hidden_id").value = packages.id;
          document.getElementById("name").value = packages.name;
          document.getElementById("travel_agency_id").value = packages.travel_agency_id;
          document.getElementById("package_type").value = packages.package_type;
          document.getElementById("price").value = packages.price;
          document.getElementById("duration_days").value = packages.duration_days;
          document.getElementById("description").value = packages.description;

          const modal = new bootstrap.Modal(document.getElementById("umrahPackageFormModal"));
          modal.show();
        } else {
          swal("Gagal", "Travel tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
    }
  });

  // RESET SAAT MENUTUP MODAL
  document.getElementById('umrahPackageFormModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById("umrahPackageForm").reset();
    document.getElementById("hidden_id").value = '';
  });

  // DELETE
  document.addEventListener("click", (e) => {
    if (e.target.closest(".umrahPackageDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".umrahPackageDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/umrahPackage/${id}`, {
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