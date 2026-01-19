document.addEventListener("DOMContentLoaded", function() {

    let roadmapIndex = 0 ;
    document.getElementById('addRoadmap').addEventListener('click', addRoadmap );
    document.getElementById('addFacilityBtn').addEventListener("click", addFacility)
   
    function addFacility(){
        const container = document.getElementById('formAddFacility');

        const row = document.createElement('div');
        row.className = 'row align-tems-center mt-1 g-2'
        row.innerHTML = `
                             
                                    <div class="col-lg-5">
                                        <input type="hidden" id="hidden_id">
                                        <input type="text"
                                        id="icon" class="form-control" name="icon" placeholder="Masukan Icon" >
                                    </div>
                                    <div class="col-lg-6">
                                        <input type="text" id="name" class="form-control" name="name" placeholder="Masukan Name" >
                                    </div>
                                    <div class="col-md-1">
                                        <button id="submitFacilityBtn" class="btn btn-success btn-sm py-2 px-3 text-muted addFa"><i class="fa fa-check-circle"></i></button>
                                    </div>
        `

        container.appendChild(row);
    }
    // Tambah Itinerary 
    function addRoadmap() {
        const container = document.getElementById('roadmap_option');

        const row = document.createElement('div');
        row.className = 'row align-items-center mb-2';

        row.innerHTML = `
                                    <div class="col-2 ">
                                        
                                        <input type="text" class="form-control" value="${roadmapIndex + 1}" readonly>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="roadmap[${roadmapIndex}][location]" placeholder="Location" required>
                                    </div>
                                    <div class="col-md-4">
                                        <input type="text" class="form-control" name="roadmap[${roadmapIndex}][activity]" placeholder="Activity" required>
                                    </div>
                                    <div class="col-md-2">
                                        <a href="#" class="btn btn-sm btn-danger roadmapDelete">
                                        <i class="fa fa-times"></i>
                                        </a>
                                    </div>
        `;
            row.querySelector('.roadmapDelete').addEventListener('click', () => {
                row.remove();
                updateRoadmapOrder();
                roadmapIndex--;
            });

            container.appendChild(row);
            roadmapIndex++;
    }

    function updateRoadmapOrder() {
        const rows = document.querySelectorAll("#roadmap_option .row");
        rows.forEach((row, index) => {
            row.querySelector("input[readonly]").value = index + 1;
        });
    }

    document.querySelectorAll(".tag-name")
    .forEach(initTagComponent);

    // LOAD DATA HOTEL UNTUK PRODUCT
    loadHotels();
    document.getElementById("formProduct").addEventListener("submit", async (e) => {
        e.preventDefault();

        const form = e.target;
        const formData = new FormData(form);

        // Ambil hotel_ids (multi select)
        const selectedHotels = Array.from(
        document.getElementById("hotelSelect").selectedOptions
        ).map(opt => opt.value);

        formData.delete("hotel_ids[]");
        selectedHotels.forEach(id => {
        formData.append("hotel_ids[]", id);
        });

        try {
        const res = await fetch("/api/product", {
            method: "POST",
            body: formData
        });

        const data = await res.json();

        if (res.ok) {
            swal("Berhasil", "Produk berhasil disimpan", "success");
            setTimeout(() => {
            window.location.href = "/products";
            }, 1500);
        } else {
            swal("Gagal", data.message || "Terjadi kesalahan", "error");
        }

        } catch (err) {
        console.error(err);
        swal("Error", "Gagal menghubungi server", "error");
        }
    })
    // LOAD FASILITAS TAMBAHAN
    loadFacilities();
    // 
    loadCategory();
    // 
    loadFlights();


async function loadFacilities() {
    const container = document.getElementById('facility-list-container')
    try {
        const res = await fetch('/api/facilities/facility');
        const result = await res.json();

        if(result.status !== "success"){
            throw new Error("Gagal ambil fasilitas")
        }

        const facilities = result.data;
        facilities.innerHTML = '';

        if(facilities.length === 0){
            container.innerHTML = "<p class='text-center'>Kosong</p> ";
            return;
        }
        
        facilities.forEach(item => {
            const facilityItem = `
                             <div class="d-flex align-items-center gap-2">
                                <div class="list-group-item d-flex justify-content-between align-items-center flex-grow-1 border-1 rounded-3">
                                        <span><i class="${item.icon} text-muted me-2" style="font-size: 0.8rem;"></i> ${item.name}</span>
                                        <i class="fas fa-check-circle text-success"></i>
                                </div>
                                 <button class="btn btn-light border deleteFacility btn-sm py-2 px-3 text-muted" data-id="${item.id}">—</button>
                            </div>
                        `;
            container.insertAdjacentHTML('beforeend', facilityItem)
        })

    } catch (error) {
        console.error(error);
        container.innerHTML = `<p class="text-center text-danger small">Error: ${error.message}</p>`;
    }
}
    // CREATE OR UPDATE
    document.getElementById('submitFacilityBtn').addEventListener("click", async () => {
        const id = document.getElementById("hidden_id").value;
        const icon = document.getElementById('icon').value;
        const name = document.getElementById('name').value;

        const isUpdate = id !== "";
        const url = isUpdate ? `/api/facilities/facility/${id}` : `/api/facilities/facility`;
        const method = isUpdate ? "PUT" : "POST";

        try {
            const res = await fetch(url, {
                method: method,
                headers: {
                    "Content-Type": "application/json",
                }, 
                body: JSON.stringify({
                icon,
                name,
                }),
            });

            const data = await res.json();

            if (res.ok) {
            swal("Berhasil!", data.message || "Hotel berhasil ditambahkan", "success");
            setTimeout(() => name.reload(), 1500);
        } else {
            swal("Gagal!", data.message || "Terjadi kesalahan saat menyimpan data", "error");
        }
        } catch (err) {
            swal("Error!", "Gagal menghubungi server ${err}", "error");
        }

    })
    // RESET SAAT MENUTUP MODAL
    document.getElementById('facilityFormModal').addEventListener('hidden.bs.modal', function () {
        document.getElementById("facilityInputForm").reset();
        document.getElementById("hidden_id").value = '';
    });
    // DELETE FACILITY
    document.addEventListener("click", (e) => {
        if(e.target.closest(".deleteFacility")) {
            e.preventDefault();
            const btn = e.target.closest(".deleteFacility");
            const id = btn?.dataset?.id || btn?.getAttribute("data-id");
            if (!id) {
                swal("Error!", "ID fasilitas tidak ditemukan.", "error");
                return;
            }

            swal({
                title: "Yakin ingin menghapus?",
                icon: "warning",
                buttons: ["Batal", "Ya, hapus!"],
                dangerMode: true,
            }).then( async (willDelete) => {
                if(willDelete) {
                    try {
                        const res = await fetch(`/api/facilities/facility/${id}`, {
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
    })

async function loadCategory() {
    try {
        const res = await fetch('/api/galleries/galleryCategory/')
        const result = await res.json();

        if(result.status !== "success"){
            throw new Error("Gagal ambil hotel");
        }
        
        const select = document.getElementById("kategory");
        select.innerHTML = "<option value=''>Pilih Kategori...</option>";

        result.data.forEach(category => {
            const option = document.createElement("option");
            option.value = category.id;
            option.textContent = `${category.name}`;
            select.appendChild(option);
        });


    } catch(error) {
        console.error(error);
         alert("Gagal memuat data category");
    }
}

async function loadFlights() {
    try {
        const res = await fetch('/api/flights/flight');
        const result = await res.json();

        if(result.status !== "success"){
            throw new Error("Gagal ambil maskapai")
        }

        const selectElements = document.querySelectorAll('.flight-select');
        selectElements.forEach(select=> {
            select.innerHTML='<option value="">Pilih Maskapai...</option';

            result.data.forEach(flight => {
                const option = document.createElement("option");
                option.value = flight.id;
                option.textContent = `${flight.airline}`;
                select.appendChild(option);
            });
        })
        //  $('.flight-select').ready(function (){
        //     $(select).select2({
        //         placeholder: "Pilih Maskapai..."
        //     })
        // })
    } catch (error) {
         console.error(error);
         alert("Gagal memuat data maskapai");
    }
}

async function loadHotels() {
    try {
        const res = await fetch('/api/hotels/hotel/');
        const result = await res.json();

        if(result.status !== "success"){
            throw new Error("Gagal ambil hotel");
        }

        const select = document.getElementById("hotelSelect");
        select.innerHTML = "";

        // Multiple Select Hotel
        $(document).ready(function (){
            $(select).select2({
                placeholder: "Pilih Hotel..."
            })
        })

         result.data.forEach(hotel => {
            const option = document.createElement("option");
            option.value = hotel.id;
            option.textContent = `${hotel.name} - ${hotel.location}`;
            select.appendChild(option);
        });

    } catch (error) {
         console.error(error);
         alert("Gagal memuat data hotel");
    }
}

new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR"
}).format(harga)

function validateFileExtension(thumbnail) {
    if(!/.(\.jpg|\.jpeg|\.png|\.gif)$/i.test(thumbnail.value)) {
        alert("Hanya file gambar yang diizinkan (jpg, jpeg, png, gif).");
        thumbnail.value = "";
        thumbnail.focus();
        return false;
    }
    return true;
}

function initTagComponent(tagInclude) {
    const input = tagInclude.querySelector('.tag-name input');
    var tags = [];

    function createTag(label) {
        const div = document.createElement('div');
        div.setAttribute('class', 'tag')
        const span = document.createElement('span');
        span.innerHTML = label;
        const closeBtn = document.createElement('i');
        closeBtn.setAttribute('class', 'fas fa-times');
        closeBtn.setAttribute('data-item', label)

        div.appendChild(closeBtn);
        div.appendChild(span);
      
        return div;

    }

    function addTag() {
        reset();
        tags.slice().reverse().forEach(function(tag){
            const input = createTag(tag);
            tagInclude.prepend(input);
        })
    }

    function reset(){
        tagInclude.querySelectorAll('.tag').forEach(function(tag){
            tag.parentElement.removeChild(tag)
        })
    }


    input.addEventListener('keydown', function(e) {
        if(e.key === 'Enter'){
            e.preventDefault();
            if(!input.value.trim()) return;

            tags.push(input.value.trim());
            addTag();
            input.value = "";
        }
    });

    tagInclude.addEventListener('click', function(e) {
        if(e.target.tagName === 'I'){
            const value = e.target.getAttribute('data-item');
            const index = tags.indexOf(value);
            tags = [...tags.slice(0, index), ...tags.slice(index + 1 )];
            addTag();
        }
    })
    
 
 
}
});
