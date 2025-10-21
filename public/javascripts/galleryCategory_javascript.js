document.addEventListener("DOMContentLoaded", () => {


    $('#galleryCategories').DataTable({
      processing: true,
      serverSide: true,
      responsive: false,
      scrollX: false,
      autowidth: true,
      ajax: {
        url: '/api/galleries/galleryCategory/datatables', // Backend endpoint
        type: 'GET',
        dataSrc: function (json) {
          console.log("DataTables response:", json); // Debugging log
          return json.data; // Extract the data array
        }
      },
      columns: [
        {
          data: 'id',
          render: function (data, type, row) {
            let buttons = `<div class="d-flex gap-2 justify-content-center">`;

            if (row.akses && row.akses.edit) {
              buttons += `
                <a href="#" class="btn btn-sm btn-warning galleryCategoryEdit" data-id="${row.id}">
                  <i class="fa fa-edit"></i>
                </a>`;
            }
            if (row.akses && row.akses.delete) {
              buttons += `
                <a href="#" class="btn btn-sm btn-danger galleryCategoryDelete" data-id="${row.id}">
                  <i class="fa fa-times"></i>
                </a>`;
            }
            buttons += `</div>`;
            return buttons;
          }
        },
        { data: 'name', title: 'Nama Kategori' },
        { data: 'slug', title: 'Slug' },
        { data: 'created_at', title: 'Dibuat Pada' }
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
        $($.fn.dataTable.tables(true)).DataTable()
          .columns.adjust();
      }
    });

    // CREATE OR UPDATE
    document.getElementById("submitGalleryCategoryBtn").addEventListener("click", async () => {
      const id = document.getElementById("hidden_id_category").value;
      const name = document.getElementById("name").value;
      const slug = document.getElementById("slug").value;
  
    // Tentukan URL dan method berdasarkan id
    const isUpdate = id !== "";
    const url = isUpdate ? `/api/galleries/galleryCategory/${id}` : `/api/galleries/galleryCategory`;
    const method = isUpdate ? "PUT" : "POST";

      try {
        const res = await fetch(url, {
          method: method,
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            name,
            slug
          }),
        });
  
        const data = await res.json();
  
        if (res.ok) {
          swal("Berhasil!", data.message || "Gallery Category berhasil ditambahkan", "success");
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
      if (e.target.closest(".galleryCategoryEdit")) {
        e.preventDefault();
        const id = e.target.closest(".galleryCategoryEdit").getAttribute("data-id");

        try {
          const res = await fetch(`/api/galleries/galleryCategory/${id}`);
          const data = await res.json();
  
          if (data.status === "success") {
            const category = data.data;
  
            document.getElementById("hidden_id_category").value = category.id;
            document.getElementById("name").value = category.name;
            document.getElementById("slug").value = category.slug;
  
            const modal = new bootstrap.Modal(document.getElementById("galleryCategoryFormModal"));
            modal.show();
          } else {
            swal("Gagal", "Gallery Category tidak ditemukan", "error");
          }
        } catch (err) {
          swal("Error", "Gagal menghubungi server", "error");
        }
      };
    });

    // RESET SAAT MENUTUP MODAL
    document.getElementById('galleryCategoryFormModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById("galleryCategoryForm").reset();
        document.getElementById("hidden_id_category").value = '';
    });
      
  
    // DELETE
    document.addEventListener("click", async (e) => {
      if (e.target.closest(".galleryCategoryDelete")) {
      e.preventDefault();
      const btn = e.target.closest(".galleryCategoryDelete");
      const id = btn.getAttribute("data-id");
    
      swal({
        title: "Yakin ingin menghapus?",
        icon: "warning",
        buttons: ["Batal", "Ya, hapus!"],
        dangerMode: true,
      }).then(async (willDelete) => {
        if (willDelete) {
        const res = await fetch(`/api/galleries/galleryCategory/${id}`, {
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
        }
      });
      }
    });
  });  