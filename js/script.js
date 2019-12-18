{
  const templates = {
    articleLink: Handlebars.compile(document.querySelector('#template-article-link').innerHTML),
    tagLink: Handlebars.compile(document.querySelector('#template-tag-link').innerHTML),
    authorLink: Handlebars.compile(document.querySelector('#template-author-link').innerHTML),
    tagCloudLink: Handlebars.compile(document.querySelector('#template-tag-cloud-link').innerHTML),
    authorCloudLink: Handlebars.compile(document.querySelector('#template-author-cloud-link').innerHTML),
  }

  const opts = {
    tagSizes: {
      count: 5,
      classPrefix: 'tag-size-',
    },
  };

  const select = {
    all: {
      articles: '.post',
    },
    article: {
      tags: '.post-tags .list',
      author: '.post-author',
      title: '.post-title',
    },
    listOf: {
      titles: '.titles',
      tags: '.tags-list',
      authors: '.authors-list',
    },
  };

  // TITLE HANDLERS

  const titleClickHandler = function(event) {
    event.preventDefault();
    const clickedElement = this;
    const activeLinks = document.querySelectorAll('.titles a.active');

    for (let activeLink of activeLinks) {
      activeLink.classList.remove('active');
    }

    clickedElement.classList.add('active');
    const activeArticles = document.querySelectorAll('.posts .active');

    for (let activeArticle of activeArticles) {
      activeArticle.classList.remove('active');
    }

    let articleSelector = clickedElement.getAttribute('href');
    const targetArticle = document.querySelector(articleSelector);
    targetArticle.classList.add('active');
  };

  function generateTitleLinks(customSelector = '') {
    const titleList = document.querySelector(select.listOf.titles);
    titleList.innerHTML = '';
    const articles = document.querySelectorAll(select.all.articles + customSelector);
    let html = '';

    for (let article of articles) {
      let articleId = article.getAttribute('id');
      let articleTitle = article.querySelector(select.article.title).innerHTML;
      const linkHTMLData = {id: articleId, title: articleTitle};
      const linkHTML = templates.articleLink(linkHTMLData);
      html = html + linkHTML;
    }

    titleList.innerHTML = html;
  }

  generateTitleLinks();

  const links = document.querySelectorAll('.titles a');
    for (let link of links) {
      link.addEventListener('click', titleClickHandler);
    }

  // TAG HANDLERS
  function calculateTagsParams(tags) {
    params = {
      min: 999,
      max: 0,
    };

    for (let tag in tags) {
      if (tags[tag] > params.max) {
        params.max = tags[tag];
      } else if (tags[tag] < params.min) {
        params.min = tags[tag];
      }
    }
    return params;
  }

  function calculateTagClass(count, params) {
    const normalizedCount = count - params.min;
    const normalizedMax = params.max - params.min;
    const percentage = normalizedCount / normalizedMax;
    const classNumber = Math.floor( percentage * (opts.tagSizes.count -1) + 1)
    return opts.tagSizes.classPrefix +classNumber;
  }

  function generateTags() {
    let allTags = {};
    const articles = document.querySelectorAll(select.all.articles);

    for (let article of articles ) {
      let tagWrapper = article.querySelector(select.article.tags);
      let html = '';
      let tags = article.getAttribute('data-tags');
      let tagArray = tags.split(' ')

      for (let tag of tagArray) {
        const linkHTMLData = {tag: tag};
        const linkHTML = templates.tagLink(linkHTMLData);
        html = html + linkHTML;
        if (!allTags.hasOwnProperty(tag)) {
          allTags[tag] = 1;
        } else {
          allTags[tag] = allTags[tag] + 1;
        };
      }

      tagWrapper.innerHTML = html;
    }

    const tagList = document.querySelector(select.listOf.tags);
    const tagsParams = calculateTagsParams(allTags);
    const allTagsData = {tags: []};

    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        className: calculateTagClass(allTags[tag], tagsParams)
      });
    }

    tagList.innerHTML = templates.tagCloudLink(allTagsData);
  }

  function tagClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#tag-', '');
    const tagActive = document.querySelectorAll('a.active[href^="#tag-"]');

    for (let tag of tagActive) {
      tag.classList.remove('active')
    }
    let properTags = document.querySelectorAll('a[href="' + href + '"]');

    for (let tag of properTags) {
      tag.classList.add('active');
    }

    generateTitleLinks('[data-tags~="' + tag + '"]');
  }

  function addClickListenersToTags() {
    const allLinks = document.querySelectorAll('a[href^="#tag-"]')

    for (let link of allLinks) {
      link.addEventListener('click', tagClickHandler);
    }
  }

  generateTags();
  addClickListenersToTags();

  // AUTHOR HANDLERS

  function generateAuthors() {
    let allAuthors = {};
    const articles = document.querySelectorAll(select.all.articles);

    for (let article of articles) {
      let authorWrapper = article.querySelector(select.article.author);
      let author = article.getAttribute('data-author');
      const linkHTMLData = {author: author};
      const linkHTML = templates.authorLink(linkHTMLData);

      if (!allAuthors.hasOwnProperty(author)) {
        allAuthors[author] = 1;
      } else {
        allAuthors[author] = allAuthors[author] + 1;
      }
      authorWrapper.innerHTML = linkHTML;
    }

    const tagList = document.querySelector(select.listOf.authors);
    const allAuthorsData = {authors: []};

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author: author,
        count: allAuthors[author],
      });
    }

    tagList.innerHTML = templates.authorCloudLink(allAuthorsData);
  }

  function authorClickHandler(event) {
    event.preventDefault();
    const clickedElement = this;
    const href = clickedElement.getAttribute('href');
    const tag = href.replace('#author-', '');
    const tagActive = document.querySelectorAll('a.active[href^="#author-"]');

    for (let tag of tagActive) {
      tag.classList.remove('active')
    }

    let properTags = document.querySelectorAll('a[href="' + href + '"]');

    for (let tag of properTags) {
      tag.classList.add('active');
    }

    generateTitleLinks('[data-author="' + tag + '"]');
  }

  function addClickListenersToAuthors() {
    const allLinks = document.querySelectorAll('a[href^="#author-"]')

    for (let link of allLinks) {
      link.addEventListener('click', authorClickHandler);
    }
  }

  generateAuthors();
  addClickListenersToAuthors();
}
