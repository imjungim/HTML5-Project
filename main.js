//api호출 함수를 생성
//URL 클래스를 사용 (url분석)
//Headers() 클래스
//키값을 보내주기 header
//response : url과 header를 붙여서 데이터받아오기.
//await을 통해 처리를 기다려주고 함수앞에 async를 통해 비동기적처리
//response된 데이터 json

//검색결과 값이 없을때의 처리는,에러가 나왔을때의 화면에 보여주는 처리는_유저에게 보여지는 값ㅠㅠㅠㅠㅠㅠ
let news=[];
let page =1;
let total_pages = 0;
let menus = document.querySelectorAll(".menus button");
menus.forEach((menu) =>
  menu.addEventListener("click", (event) => getNewsByTopic(event))
);
let searchButton = document.getElementById("search-button");
let inputEnter = document.getElementById("search-input"); //검색 enter
inputEnter.addEventListener("keypress",(event)=>{
  if(event.key === "Enter"){
    //event.preventDefault();
    searchButton.click();
  }
});
let url; //전역변수 선언.

const getNews = async () => {
 try{
  let header = new Headers({
    "x-api-key": "CHi75Ke2MijpxyWNTi6p2fTjojQ75EW9oQSwe0uZ218",
  });
  url.searchParams.set('page',page) // url 쿼리 변경 &page = page전역변수의 값
  console.log("url?:",url)
  let response = await fetch(url, { headers: header }); //데이터를 보내기 fetch
  //console.log(response) //Promise {<pending>} : 데이터가 아직 도착하지 않음
  let data = await response.json(); //서버로부터 데이터를 받아오는 시간이 필요하기때문에 await

    if(response.status == 200){ //200 은 정상값
      if(data.total_hits ==0){ //total_hits 뉴스데이터
        throw new Error("검색된 결과값이 없습니다.")
      } //error발생 시 건너뛰게 됨
      console.log("data는?",data)//api에서 받은 데이터
      news = data.articles;
      console.log(news)
      total_pages = data.total_pages;
      page = data.page;

      render(); //화면에 데이터 뿌려주기
      pagenation();
    }else{ //문제 (에러)가 있으면
      throw new Error(data.message) //Error객체
    }
  
 }catch(error){
   console.log("잡힌 에러",error.message)
   errorRender(error.message);
 }
    
}; //에러 발생 시 articles키 자체가 data값에서 사라짐
  const getLatestNews = async () => {
    url = new URL(
      `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&topic=sport&page_size=10`
    );

    getNews();
  };

  const getNewsByTopic = async (event) => {
    console.log("click됨", event.target.textContent); //태그안의 내용만 가져오기

    let topic = event.target.textContent.toLowerCase();
    url = new URL(
      `https://api.newscatcherapi.com/v2/latest_headlines?countries=KR&page_size=10&topic=${topic}`
    );
    console.log("url:", url);

    getNews();
  };

  const getNewsByKeyword = async () => {
    //1.입력한 검색 키워드를 가져오기
    //2.url에 검색키워드 붙이기

    let keyword = document.getElementById("search-input").value;
    console.log("keyword", keyword);
    url = new URL(
      `https://api.newscatcherapi.com/v2/search?q=${keyword}&countries=KR&page_size=10`
    );
    console.log("uu", url);

    getNews();
  };

  //화면에보여주기
  const render = () => {
    let newsHTML = "";
    //news배열 아이템을 꺼내기.
    //item(각 뉴스 아이템)으로..
    newsHTML = news
      .map((item) => {
        return `<div class = "row news"> 
    <div class="col-lg-4">
      <img class = "news-img-size"src="${
        item.media ||
        "https://usagi-post.com/wp-content/uploads/2020/05/no-image-found-360x250-1.png"
      }" alt=""/>
    </div>
    <div class="col-lg-8">
      <h2><a href=${item.link}>${item.title}</a></h2>
      <p> 
        ${
          item.summary == null || item.summary == ""
            ? "내용없음"
            : item.summary.length > 200
            ? item.summary.substring(0, 200) + "..."
            : item.summary
        }
      </p>
      
      <div>
        ${item.rights || "no source"} * ${moment(item.published_date).fromNow()}
      </div>
    </div>
  </div>`;
      })
      .join(""); //map의 결과값 array를 string으로 변환 array to string _ join()

    document.getElementById("news-board").innerHTML = newsHTML;
  };


  //에러를 보여주는함수
  const errorRender = (message) => {
    let errorHTML = `<div class="alert alert-danger text-center" role="alert">
    ${message}
  </div>`
    document.getElementById("news-board").innerHTML = errorHTML;
    //newsHTML에 뉴스 대신 에러
  }


  const pagenation = () => {
    let pagenationHTML = ``;

    //total_page
    //page url페이지숫자
    //page group
    let pageGroup = Math.ceil(page/5);//page/5 올림
    //last page
    let last = pageGroup * 5;
    //first page
    let first = last -4
    //first~last page print
    if(first >=6){
      pagenationHTML =`
      <li class="page-item"> 
        <a class="page-link" href="#" aria-label="Previous" onclick = "moveToPage(1)">
          <span aria-hidden="true">&lt&lt;</span> 
        </a>
      </li>
      <li class="page-item">
      <a class="page-link" href="#" aria-label="Previous" onclick = "moveToPage(${page-1})">
        <span aria-hidden="true">&lt;</span>
      </a>
    </li>`
    }

    for(let i = first; i <= last ; i++){
      pagenationHTML += `<li class="page-item 
      ${page == i ? "active" : ""}"><a class="page-link" href="#" onclick ="moveToPage(${i})">${i}</a></li>`;
    }

    if(last<total_pages){
      pagenationHTML +=`<li class="page-item">
      <a class="page-link" href="#" aria-label="Next" onclick ="moveToPage(${page+1})">
        <span aria-hidden="true">&gt;</span>
      </a>
        </li>
        <li class="page-item">
        <a class="page-link" href="#" aria-label="Next" onclick ="moveToPage(${total_pages})">
          <span aria-hidden="true">&gt&gt;</span>
        </a>
      </li>
        `

    }

    document.querySelector(".pagination").innerHTML = pagenationHTML;//pagination  html태그 선택
  };
  //페이지 이동
  const moveToPage = (pageNum) => {
    //1. 이동하고 싶은 페이지
    page = pageNum 

    //2. 이동하고 싶은 페이지를 가지고 api를 다시 호출 
    //url에 페이지에 대한 쿼리정보 getNews 에&page값넣어주기.
    getNews(); 

  }

  searchButton.addEventListener("click", getNewsByKeyword); 
  getLatestNews();

