
import { myFetch } from './helper.js';

const main = document.querySelector('main');
const home = document.getElementById('home')
const sortoption = document.getElementById('sortoption')
const createsong = document.getElementById('createsong')
let keyword = 'title';
let errorMsg = ""

createsong.addEventListener('click', async () => {

main.innerHTML = ''

const postform = `<form method="post" id="postform">
    <label for="title">Title: </label>
    <input type="text" id="title" name="title" placeholder="Title">
    <label for="content">Content: </label>
    <textarea id="content" name="content" placeholder=""></textarea>
    <label for="artist_id">Artist name: </label>
    <input type="text" placeholder="Enter artist name" id="artist_id" name="artist_id">
    <b id="error"></b>
    <button type="button" id="send">Create song</button>
  </form>`;
  
let title
let content
let artist_id
  
main.innerHTML = postform;

const form = main.querySelector("form");
    
form.title.addEventListener('change', (e) => {
    title = e.target.value
})
form.content.addEventListener('change', (e) => {
    content = e.target.value
})
form.artist_id.addEventListener('change', (e) => {
    artist_id = e.target.value
})

const submitbutton = main.querySelector("#send")
  
submitbutton.addEventListener("click", async () => {
      
    const artistID = await getArtistID(form.artist_id.value)
    console.log("artist id is: ", artistID)
      
    if (artistID != null){    
    const params = new URLSearchParams();
        params.append("title", form.title.value);
        params.append("content", form.content.value);
        params.append("artist_id", artistID)
   
    let options = {
        method: 'POST',
        body: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
    };
        
    const data = await myFetch(`http://localhost:4000/api/song`, options);
        if(data) {
            await getSongList()
        }
        } else {
        let error = document.getElementById("error")
        error.innerText = "Could not find artist name"
        setTimeout(() => {
            error.innerText = ""
        },3000)
    }
});
})

function updateSong() {
    reset()
const putform = `<form method="put" id="putform">
    <label for="id">Id: </label>
    <input type="number" id="id" name="id">
    <label for="title">Title: </label>
    <input type="text" id="title" name="title" placeholder="Title">
    <label for="content">Content: </label>
    <textarea id="content" name="content" placeholder=""></textarea>
    <label for="artist_id">artist_id: </label>
    <input type="number" id="artist_id" name="artist_id">
    <button type="button" id="update">Update song</button>
  </form>`;

let id
let title
let content
let artist_id
    
    main.innerHTML = putform;
    const form = main.querySelector("form");

    form.id.addEventListener('change', (e) => {
        id = e.target.value
    })
    form.title.addEventListener('change', (e) => {
        title = e.target.value
    })
    form.content.addEventListener('change', (e) => {
        content = e.target.value
    })
    form.artist_id.addEventListener('change', (e) => {
        artist_id = e.target.value
    })
    const updatesubmit = main.querySelector("#update")

    updatesubmit.addEventListener("click", async () => {

       const params = new URLSearchParams();

       params.append("id", form.id.value)
       params.append("title", form.title.value);
       params.append("content", form.content.value);
       params.append("artist_id", form.artist_id.value)

      let options = {
        method: 'PUT',
        body: params,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        }
      };
   
       const data = await myFetch(`http://localhost:4000/api/song`, options);
       if(data) {
            await getSongList()   
        }
    });
}

const getArtistID = async (keyword) => {
    const fetchHeaders = new Headers();
    fetchHeaders.append("Accept", "application/json");

    console.log("Getting artist id for ", keyword)
    const options = {
        headers: fetchHeaders,
    }
    const data = await myFetch(`http://localhost:4000/api/song`, options);
    let id = 0
    data?.forEach(song => {
        if (song.artist.name.toLowerCase().includes(keyword.toLowerCase())){
            console.log(song.artist.id)
            id = song.artist.id
        }
    })

    if (id === 0){
        id = null
    }
    return id
}

const getSongList = async () => {
    // Kalder data
    reset()
    const fetchHeaders = new Headers();
    fetchHeaders.append("Accept", "application/json");

    const options = {
        headers: fetchHeaders,
    }
    const data = await myFetch(`http://localhost:4000/api/song?orderby=${keyword}`, options);
    console.log(data)
    // Mapper data
    data.map(function(item, key) {
        // Definerer div wrapper
    const wrapper = document.createElement('li');
    wrapper.classList.add('linkwrapper')
    const songNumber = document.createElement('a')
    songNumber.classList.add('songid')
    songNumber.innerHTML = `Id: ${item.id}`
    // Definerer anchor tag med tekst og click event
    const link = document.createElement('a');
    link.classList.add('link')
    const title = document.createElement('b');
    title.classList.add('title')
    const deletebtn = document.createElement('button')
    deletebtn.innerText = 'Delete song'
    const updatebtn = document.createElement('button')
    updatebtn.innerText = 'Update song'
    link.innerText =  `Artist: ${item.artist.name} - `;
    title.innerText = `Title: ${item.title}`
    // Click event kalder detalje funktion med målets id
    title.addEventListener('click', () => {
            getSongDetails(item.id);
    })
    updatebtn.addEventListener('click', () => {
            updateSong(item.id);
    })
    deletebtn.addEventListener('click', () => {
            if(confirm(`Are you sure you want to delete ${item.title} from Songbook?`)) {
                deleteSong(item.id)
            }
    })  
    wrapper.append(songNumber, title, link, deletebtn ,updatebtn);
    main.append(wrapper);
        
    const searchField = document.getElementById('search')
    searchbtn.addEventListener('click', () => {
    wrapper.style.display = 'grid'
            if(link.innerHTML.toLowerCase().includes(searchField.value) || title.innerHTML.toLowerCase().includes(searchField.value)) {
                console.log(123)
            } else {
                wrapper.style.display = 'none'
            }
        })
    }) 
}

sortoption.addEventListener('change', async (e) => {
    console.log(e.target.value)
    keyword = e.target.value
    getSongList()
})

const deleteSong = async song_id => {
        let options = {
            method: 'DELETE'
        }
        const data = await myFetch(`http://localhost:4000/api/song/${song_id}`, options);
        window.location.reload()
    }
     
    getSongList();
    
    /**
     * Funktionsvariabel til at hente mål detaljer
     * @param {number} song_id 
     */
    const getSongDetails = async song_id => {
        reset();
        
        // Kalder data
        const data = await myFetch(`http://localhost:4000/api/song/${song_id}`);
        
        const div = document.createElement('div');
        div.classList.add('detailwrapper')
        
        const h2 = document.createElement('h2')
        h2.innerText = data.title;
        
        const pre = document.createElement('pre')
        pre.innerHTML = data.content;
        
    div.append(h2, pre);
    main.append(div)
}

home.addEventListener('click', () => {
    location.reload()
})

function reset() {
    main.innerHTML = '';
}