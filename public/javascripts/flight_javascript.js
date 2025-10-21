document.addEventListener("DOMContentLoaded", () => {

  $('#flightTable').DataTable({
    processing: true,
    serverSide: true,
    responsive: false,
    scrollX: false,
    autowidth: true,
    ajax: {
      url: '/api/flights/flight/datatables', // Backend endpoint
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
        //   console.log("Data ID:", row); // Debugging log
          let buttons = `<div class="d-flex gap-2 justify-content-center">`;

          if (row.akses && row.akses.edit) {
            buttons += `
              <a href="#" class="btn btn-sm btn-warning flightEdit" data-id="${row.id}">
                <i class="fa fa-edit"></i>
              </a>`;
          }
          if (row.akses && row.akses.delete) {
            buttons += `
              <a href="#" class="btn btn-sm btn-danger flightDelete" data-id="${row.id}">
                <i class="fa fa-times"></i>
              </a>`;
          }

          buttons += `</div>`;
          return buttons;
        }
      },
      { data: 'airline', title: 'Airline' },
      { data: 'flight_number', title: 'Flight Number' },
      { data: 'departure_airport', title: 'Departure' },
      { data: 'arrival_airport', title: 'Arrival' },
      { data: 'departure_time', title: 'Departure Time' },
      { data: 'arrival_time', title: 'Arrival Time' }
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

  // CREATE OR UPDATE
  document.getElementById("submitFlightBtn").addEventListener("click", async () => {
    const id = document.getElementById("hidden_id").value;
    const airline = document.getElementById("airline").value;
    const flight_number = document.getElementById("flight_number").value;
    const departure_airport = document.getElementById("departure_airport").value;
    const arrival_airport = document.getElementById("arrival_airport").value;
    const departure_time = document.getElementById("departure_time").value;
    const arrival_time = document.getElementById("arrival_time").value;

    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/flights/flight/${id}` : `/api/flights/flight`;
    const method = isUpdate ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          airline,
          flight_number,
          departure_airport,
          arrival_airport,
          departure_time,
          arrival_time,
        }),
      });

      const data = await res.json();

      if (res.ok) {
        swal("Berhasil!", data.message || "Flight berhasil ditambahkan", "success");
        setTimeout(() => location.reload(), 1500);
      } else {
        swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
      }
    } catch (err) {
      swal("Error!", "Gagal menghubungi server", "error");
    }
  });

//   // MENGISI VALUE FORM (EDIT)
  document.addEventListener("click", async (e) => {
    if (e.target.closest(".flightEdit")) {
      e.preventDefault();
      const btn = e.target.closest(".flightEdit");
      const id = btn.getAttribute("data-id");

      try {
        const res = await fetch(`/api/flights/flight/${id}`);
        const data = await res.json();

        if (data.status === "success") {
          const flight = data.data;

            document.getElementById("hidden_id").value = flight.id;
            document.getElementById("airline").value = flight.airline;
            document.getElementById("flight_number").value = flight.flight_number;
            document.getElementById("departure_airport").value = flight.departure_airport;
            document.getElementById("arrival_airport").value = flight.arrival_airport;
            document.getElementById("departure_time").value = flight.departure_time;
            document.getElementById("arrival_time").value = flight.departure_time;

          const modal = new bootstrap.Modal(document.getElementById("flightFormModal"));
          modal.show();
        } else {
          swal("Gagal", "Flight tidak ditemukan", "error");
        }
      } catch (err) {
        swal("Error", "Gagal menghubungi server", "error");
      }
    }
  });

//   // RESET SAAT MENUTUP MODAL
  document.getElementById('flightFormModal').addEventListener('hidden.bs.modal', function () {
    document.getElementById("hotelInput").reset();
    document.getElementById("hidden_id").value = '';
  });

//   // DELETE
  document.addEventListener("click", (e) => {
    if (e.target.closest(".flightDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".flightDelete");
      const id = btn.getAttribute("data-id");

      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
          try {
            const res = await fetch(`/api/flights/flight/${id}`, {
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
