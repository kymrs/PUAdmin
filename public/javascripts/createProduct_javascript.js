document.addEventListener("DOMContentLoaded", function() {
    let roadmapIndex = 0 ;
    document.getElementById('addRoadmap').addEventListener('click', addRoadmap );
    document.getElementById('addHotel').addEventListener('click', addHotel);

    function addRoadmap() {
        const container = document.getElementById('roadmap_option');

        const row = document.createElement('div');
        row.className = 'row align-items-center mb-2';

        row.innerHTML = `
                                    <div class="col-2">
                                        <input type="text" class="form-control" value="Hari ${roadmapIndex + 1}" readonly>
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

    // function addHotel() {
    //     const hotelForm = document.getElementById('additional_hotel');

    //     const row = document.createElement('div');

    //     row.innerHTML = `
    //                            <div class="form-group col">
    //                             <label class="col">
    //                             Hotel<span class="text-danger">*</span>
    //                             </label>
    //                              <div class="col">
    //                                 <select name="hotels[0][city]" class="form-select">
    //                                     <option value="MEKKAH">Mekkah</option>
    //                                     <option value="MADINAH">Madinah</option>
    //                                 </select>
    //                              </div>     
    //                         </div>
    //                         <div class="form-group col">
    //                             <label >Fasilitas<span class="text-danger">*</span></label>
    //                                  <div class="container-tag" data-name="hotel_facilities">
    //                                     <div class="tag-name">
    //                                         <input type="text" class="input-tag-custom" placeholder="Type and hit enter">
    //                                     </div>
                                        
    //                                 </div>
    //                         </div>
    //                         <div class="form-group row">
    //                                 <label class="col-md-3">
    //                                     Gallery<span class="text-danger">*</span>
    //                                 </label>
    //                                 <div class="col-sm-8">
    //                                     <input type="file" class="form-control-file" name="gallery" onchange="validateFileExtension(this)">
    //                                 </div>
    //                         </div>
    //     `;
    //     hotelForm.appendChild(row);
    // }

    function updateRoadmapOrder() {
        const rows = document.querySelectorAll("#roadmap_option .row");
        rows.forEach((row, index) => {
            row.querySelector("input[readonly]").value = index + 1;
        });
    }

    document.querySelectorAll(".tag-name")
    .forEach(initTagComponent);
});

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

        div.appendChild(span);
        div.appendChild(closeBtn);
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