const express = require('express');
const app = express();
const uuid = require('uuid/v4');
const bodyParser = require('body-parser')
const jsonParser = bodyParser.json();

const post = [
	{
		id: uuid(),
		title: "How to climb for dummies",
		content: "Climbing",
		author: "Mr. Loro",
		publishDate: new Date()
	}, {
		id: uuid(),
		title: "How to teach climbing",
		content: "Climbing",
		author: "Mr. Chuy",
		publishDate: new Date()
	}, {
		id: uuid(),
		title: "Is it safe to climb?",
		content: "Climbing",
		author: "Mr. Chuy",
		publishDate: new Date()
	}, {
		id: uuid(),
		title: "How to set up a route",
		content: "Climbing",
		author: "Mr. Chuy",
		publishDate: new Date()
	}, {
		id: uuid(),
		title: "How belay safetly",
		content: "Climbing",
		author: "Mr. Loro",
		publishDate: new Date()
	}
]

// GET all blog posts
app.get('/blog-posts', (req, res) => {
	// Response
	res.status(200).json({
		message: 'Succefully sent the posts',
		status: 200,
		posts: post
	});
});

// GET all posts by author as path parameter
app.get('/blog-posts/:author', (req, res) => {
	let author = req.params.author;

	if (!author) {
		res.status(406).json({
			message: "Missing param 'author'",
			status: 406
		});
	}

	listPosts = [];
	post.forEach(item => {
		if (item.author == author) {
			listPosts.push(item);
		}
	});

	if (listPosts.length == 0) {
		res.status(404).json({
			message: 'Author not found',
			status: 404
		});
	} else {
		res.status(200).json({
			message: 'Author found',
			status: 200,
			listPosts: listPosts
		})
	}
});

// POST
app.post('/blog-posts', jsonParser, (req, res) => {
	// Validate all fields are sent in body
	let reqFields = ['title', 'content', 'author', 'publishDate'];
	for (i in reqFields) {
		let currentField = reqFields[i];

		if (!(currentField in req.body)) {
			res.status(406).json({
				message: `Missing field '${currentField}' in body.`,
				status: 406
			}).send('Finish');
		}
	}

	// Create new post to add and push it to array
	let newPost = {
		id: uuid(),
		title: req.body.title,
		content: req.body.content,
		author: req.body.author,
		publishDate: req.body.publishDate
	}
	post.push(newPost);

	res.status(201).json({
		message: 'Succesfully POST',
		status: 201,
		newPost: newPost
	})

});

// DELETE post by ID
app.delete('/blog-posts/:id', jsonParser, (req, res) => {

	if (!('id' in req.body)) {
		res.status(406).json({
			message: 'Missing id field',
			status: 406
		});
	}

	let postId = req.params.id;
	if (postId) {
		if (postId == req.body.id) {
			post.forEach((item, index) => {
				if (item.id == postId) {
					post.splice(index, 1);

					res.json({
						message: 'Succesfully deleted',
						status: 204,
						post: item
					}).status(204);
				}
			});
			res.status(404).json({
				message: 'Post not founded',
				status: 404
			});
		} else {
			res.status(400).json({
				message: 'Parameters do not match',
				status: 400
			});
		}
	} else {
		res.status(406).json({
			message: 'Missing id in parameters',
			status: 406
		});
	}
});

// PUT update post
app.put('/blog-posts/:id', jsonParser, (req, res) => {
	let id = req.params.id;
	let postObj = req.body;

	if (id) {
		if (Object.keys(postObj).length) {
			post.forEach(item => {
				if (id == item.id) {
					if ('title' in postObj) {
						item.title = postObj.title;
					}
					if ('content' in postObj) {
						item.content = postObj.content;
					}
					if ('author' in postObj) {
						item.author = postObj.author;
					}
					if ('publishDate' in postObj) {
						item.publishDate = postObj.publishDate;
					}
					res.status(200).json({
						message: 'Post updated', 
						status: 200,
						post: item
					});
				}
			});
		} else {
			res.status(404).json({
				message: 'Missing body parameters',
				status: 404
			});
		}
	} else {
		res.status(406).json({
			message: 'Missing id in parameters',
			status: 406
		});
	}
});

app.listen(8080, () => {
	console.log('Your app is running in port 8080');
});
