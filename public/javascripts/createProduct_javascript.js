document.addEventListener("DOMContentLoaded", function() {
    const noteInput = document.getElementById('note');
    const btnAddNote = document.getElementById('addNote');
    const noteContainer = document.getElementById('note-container');
    let roadmapIndex = 0 ;
    document.getElementById('addRoadmap').addEventListener('click', addRoadmap );
   
    // Tamabah Note START
    function addNewNote() {
        
        const inputValue = noteInput.value.trim();
        if(inputValue !== ""){
                        const li = document.createElement('li');
                        li.className = "note-list d-flex justify-content-between align-items-center border-radius px-2";

                        li.innerHTML = `
                        <span>${inputValue}</span>
                        <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

                        // Masukkan ke dalam container ul
                        noteContainer.appendChild(li);

                        //meng kosongkan input
                        noteInput.value = "";
                        noteInput.focus();

                    } else {
                        alert("Catatan tidak boleh kosong");
                    }
    }
    btnAddNote.addEventListener("click", function() {
        addNewNote();
    })

    noteInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            addNewNote();
        }
    })
    // Tambah Note END

    // Tmbah Include Fasilitas START
    const includeInput = document.getElementById('includde-fclty');
    const includeContainer = document.getElementById('include-container');

    function addIncludeFacility() {
        const inputValue = includeInput.value.trim();
        if(inputValue !== ""){
            const li = document.createElement("li");
            li.className = "include-list d-flex justify-content-between align-items-center border-radius px-2";

            li.innerHTML = `
            <span>${inputValue}</span>
            <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

            includeContainer.appendChild(li);
            includeInput.value = "";
            includeInput.focus();
        } else {
            alert("Fasilitas tidak boleh kosong");
        }
    }
    
    includeInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            addIncludeFacility();
        }
    })
    // Tmbah Include Fasilitas END

    // Tmbah Exclude Fasilitas START
    const excludeInput = document.getElementById('exclude-fclty');
    const excludeContainer = document.getElementById('exclude-container');

    function addExcludeFacility() {
        const inputValue = excludeInput.value.trim();
        if(inputValue !== ""){
            const li = document.createElement("li");
            li.className = "exclude-list d-flex justify-content-between align-items-center border-radius px-2";

            li.innerHTML = `
            <span>${inputValue}</span>
            <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

            excludeContainer.appendChild(li);
            excludeInput.value = "";
            excludeInput.focus();
        } else {
            alert("Fasilitas tidak boleh kosong");
        }
    }
    
    excludeInput.addEventListener("keydown", function(e) {
        if(e.key === "Enter"){
            e.preventDefault();
            addExcludeFacility();
        }
    })
    // Tmbah Exclude Fasilitas END

    // Tambah Syarat & Ketentuan START
        const termsInput = document.getElementById('snk');
        const termsContainer = document.getElementById('snk-container');

        function addTerms() {
            const inputValue = termsInput.value.trim();
            if(inputValue !== ""){
                const li = document.createElement("li");
                li.className = "snk-list d-flex justify-content-between align-items-center border-radius px-2";

                li.innerHTML = `
                <span>${inputValue}</span>
                <button class="btn btn-sm " onclick="this.parentElement.remove()"><i class="fas fa-times"></i></button>`;

                termsContainer.appendChild(li);
                termsInput.value = "";
                termsInput.focus();
            } else {
                alert("Syarat & Ketentuan tidak boleh kosong");
            }
        }
        termsInput.addEventListener("keydown", function(e) {
            if(e.key === "Enter"){
                e.preventDefault();
                addTerms();
            }
        })
    // Tmbah Syarat & Ketentuan END
   
    // Tambah Itinerary START
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
    // Tambah Itinerary END

    function updateRoadmapOrder() {
        const rows = document.querySelectorAll("#roadmap_option .row");
        rows.forEach((row, index) => {
            row.querySelector("input[readonly]").value = index + 1;
        });
    }

    document.querySelectorAll(".tag-name")
    .forEach(initTagComponent);

    // LOAD DATA HOTEL UNTUK PRODUCT
    // document.getElementById("formProduct").addEventListener("submit", async (e) => {
    //     e.preventDefault();

    //     const form = e.target;
    //     const formData = new FormData(form);

    //     // Ambil hotel_ids (multi select)
    //     const selectedHotels = Array.from(
    //     document.getElementById("hotelSelect").selectedOptions
    //     ).map(opt => opt.value);

    //     formData.delete("hotel_ids[]");
    //     selectedHotels.forEach(id => {
    //     formData.append("hotel_ids[]", id);
    //     });

    //     try {
    //     const res = await fetch("/api/product", {
    //         method: "POST",
    //         body: formData
    //     });

    //     const data = await res.json();

    //     if (res.ok) {
    //         swal("Berhasil", "Produk berhasil disimpan", "success");
    //         setTimeout(() => {
    //         window.location.href = "/products";
    //         }, 1500);
    //     } else {
    //         swal("Gagal", data.message || "Terjadi kesalahan", "error");
    //     }

    //     } catch (err) {
    //     console.error(err);
    //     swal("Error", "Gagal menghubungi server", "error");
    //     }
    // })
    // LOAD FASILITAS TAMBAHAN
    // 
    loadCategory();
    // 
    fetchHotelFacility()


    window.facilityState = {
        include: new Set(),
        exclude: new Set()
    };

   





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

 async function fetchHotelFacility() {
    // Ambil semua elemen dengan class tersebut
    const containers = document.querySelectorAll(".facility-container");
    
    try {
        const res = await fetch("/api/facilities/facility/");
        const result = await res.json();

        if (result.status !== "success") {
            throw new Error("Gagal ambil fasilitas hotel");
        }

        // Kita looping setiap container yang ada di halaman (Mekkah & Madinah)
        containers.forEach((container) => {
            container.innerHTML = ""; // Kosongkan loading

            // Di dalam setiap container, kita looping data fasilitasnya
            result.data.forEach((facility) => {
                // Beri prefix unik pada ID agar ID checkbox Mekkah tidak bentrok dengan Madinah
                const uniqueId = `${container.id || 'fac'}-${facility.id}`;
                
                const checkboxHTML = `
                    <input type="checkbox" 
                           name="facility_ids[]" 
                           class="btn-check" 
                           id="${uniqueId}" 
                           autocomplete="off" 
                           value="${facility.id}">
                    <label class="btn btn-outline-primary text-dark mb-1" for="${uniqueId}">
                        ${facility.name}
                    </label>
                `;
                
                container.insertAdjacentHTML('beforeend', checkboxHTML);
            });
        });

    } catch (error) {
        console.error(error);
        // Tampilkan error di semua container
        containers.forEach(c => c.innerHTML = `<span class="text-danger">Gagal memuat.</span>`);
    }
}
    //  async function fetchHotelFacility() {
//     const container = document.querySelectorAll('.facility-container');
    
//     try {
//         const res = await fetch("/api/facilities/facility/");
//         const result = await res.json();

//         if (result.status !== "success") {
//             throw new Error("Gagal ambil fasilitas hotel");
//         }

//         // Kosongkan loading text
//         container.innerHTML = "";

//         // Asumsi data fasilitas ada di result.data
//         // Contoh struktur data: [{id: 1, name: 'Wifi'}, {id: 2, name: 'AC'}]
//         result.data.forEach((facility, index) => {
//             const checkboxHTML = `
//                 <input type="checkbox" 
//                        class="btn-check" 
//                        name="facilities[]" 
//                        id="facility-${facility.id}" 
//                        value="${facility.id}" 
//                        autocomplete="off">
//                 <label class="btn btn-outline-primary rounded-pill" for="facility-${facility.id}">
//                     ${facility.name}
//                 </label>
//             `;
            
//             // Masukkan ke dalam container
//             container.insertAdjacentHTML('beforeend', checkboxHTML);
//         });

//     } catch (error) {
//         console.error(error);
//         container.innerHTML = `<span class="text-danger">Gagal memuat fasilitas.</span>`;
//     }
// }


    async function loadCategory() {
        try {
            const res = await fetch('/api/galleries/galleryCategory/')
            const result = await res.json();

            if(result.status !== "success"){
                throw new Error("Gagal ambil hotel");
            }
            
            const selectElements = document.querySelectorAll(".kategory");
            selectElements.forEach(select=>{
                select.innerHTML = "<option value=''>Pilih Kategori...</option>";

                result.data.forEach(category => {
                    const option = document.createElement("option");
                    option.value = category.id;
                    option.textContent = `${category.name}`;
                    select.appendChild(option);
                });
            })

            $('.kategory').select2({
                placeholder: "Pilih Category...",
                allowClear: true,
                width: '100%'
            });


        } catch(error) {
            console.error(error);
            alert("Gagal memuat data category ");
        }
    }