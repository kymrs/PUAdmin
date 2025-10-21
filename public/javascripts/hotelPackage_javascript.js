document.addEventListener("DOMContentLoaded", () => {
  $('#hotelPackage').DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: '/api/hotels/hotelPackage/datatables', // Backend endpoint
      type: 'GET',
      dataSrc: function (json) {
        // console.log("DataTables response:", json); // Debugging log
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
              <a href="#" class="btn btn-sm btn-warning travelEdit" data-id="${row.id}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger travelDelete" data-id="${row.id}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        }
      },
      { data: 'package_id', title: 'Nama Paket' },
      { data: 'hotel_id', title: 'Nama Hotel' },
      { data: 'location', title: 'Lokasi' },
      { data: 'number_of_night', title: 'Durasi Penginapan' },
      { data: 'created_at', title: 'Dibuat Pada' }
    ],
    drawCallback: function () {
      // Force redraw untuk sync header & body
      $($.fn.dataTable.tables(true)).DataTable().columns.adjust();
    },
    "columnDefs": [
      {
        "targets": [],
        "className": 'dt-body-nowrap'
      }, {
        "targets": [],
        "orderable": false,
      },
      ]
  });

      var distanceInput = document.getElementById('distance');
      var numberOfNightInput = document.getElementById('number_of_night');
        if (distanceInput) {
          distanceInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
          });
        } 

        if (numberOfNightInput) {
          numberOfNightInput.addEventListener('input', function(e) {
            this.value = this.value.replace(/[^0-9]/g, '');
          });
        }

  // CREATE OR UPDATE
  document.getElementById("submitHotelPackageBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id").value;
    const name = document.getElementById("name").value;
    const logo_url = document.getElementById("logo_url").value;
    const description = document.getElementById("description").value;
    const contact_person = document.getElementById("contact_person").value;
    const phone = document.getElementById("phone").value;
    const email = document.getElementById("email").value;
    const address = document.getElementById("address").value;
    const website = document.getElementById("website").value;
    const is_verified = document.getElementById("is_verified").value;

    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/travel/${id}` : `/api/travel`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name,
          logo_url,
          description,
          contact_person,
          phone,
          email,
          address,
          website,
          is_verified: parseInt(is_verified),
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
    if (e.target.closest(".travelEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".travelEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/travel/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const travel = data.data;

          document.getElementById("hidden_id").value = travel.id;
          document.getElementById("name").value = travel.name;
          document.getElementById("logo_url").value = travel.logo_url;
          document.getElementById("description").value = travel.description;
          document.getElementById("contact_person").value = travel.contact_person;
          document.getElementById("phone").value = travel.phone;
          document.getElementById("email").value = travel.email;
          document.getElementById("address").value = travel.address;
          document.getElementById("website").value = travel.website;
          document.getElementById("is_verified").value = travel.is_verified;

          const modal = new bootstrap.Modal(document.getElementById("travelFormModal"));
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
  document.getElementById('travelFormModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById("travelForm").reset();
    document.getElementById("hidden_id").value = '';
  });

  // DELETE
  document.addEventListener("click", (e) => {
    if (e.target.closest(".travelDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".travelDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/travel/${id}`, {
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
