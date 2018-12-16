// 导入 express 模板
const express = require('express')
// 导入 body-parser 模板
const bodyParser = require('body-parser')
// 导入 mysql 数据库模板
const mysql = require('mysql')
const moment = require('moment')
// 调用 express() 方法
const app = express()


app.use(bodyParser.urlencoded({ extended: false }))
// 设置 mysql的连接
const conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'blog'
})




// 设置静态托管
app.use('/node_modules', express.static('./node_modules'))

// 设置模板引擎
app.set('view engine', 'ejs')
// 设置模板存放路径, 如果不设置 默认的久存放在 views 目录
app.set('views', './views')
// 使用 res.render()来渲染模板页面
app.get('/', (req, res) => {
    res.render('index.ejs', {})
})



// 渲染 register
app.get('/register', (req, res) => {
    res.render('./user/register', {})
})
app.post('/register', (req, res) => {
    console.log(req.body)
    let userInfo = req.body
    if (!userInfo.username || !userInfo.nickname || !userInfo.password) return res.status(400).send({
        status: 400,
        msg: '请输入正确的表单信息!!!'
    })

    // 查看 判断用户名是否已经存在  链接数据查询
    const chachongSql = 'select count(*) count from users where username = ?'
    conn.query(chachongSql, userInfo.username, (err, result) => {
        if (err) return res.status(500).send({
            status: 500,
            msg: '查重失败!请重试!'
        })

        if (result[0].count !== 0) return res.status(400).send({
            status: 400,
            msg: '用户名重复!请重试!'
        })
        // 能到此步  说明可以注册


        // 添加 ctime 时间字段
        userInfo.citem = moment().format('YYYY-MM-DD HH:mm:ss')

console.log(userInfo)
        const registerSql = 'insert into users set ?'
        conn.query(registerSql, userInfo, (err, result) => {
            if (err) return res.status(500).send({
                status: 500,
                msg: '注册失败!!请重试!!'
            })
            // 让浏览器调到登录页面
            // 302重定向
            // res.redirect('./login')
            res.send({
                status: 200,
                msg: '注册成功!'
            })
        })
    })

})

// 渲染 login
app.get('/login', (req, res) => {
    res.render('./user/login', {})
})
app.post('/login', (req, res) => {
    console.log(req.body)
    // 直接去数据库查询语句,  条件是 username 和 password
    const loginSql = 'select * from users where username = ? and password = ?'
    conn.query(loginSql, [req.body.username, req.body.password], (err, result) => {
        console.log(err)
        if (err || result.length === 0) return res.status(400).send({
            status: 400,
            msg: '登录失败!请重试!'
        })
        // 登录成功
        res.send({
            status: 200,
            msg: '登录成功!'
        })
    })
})





// 开启服务器
app.listen(8080, () => {
    console.log('http://127.0.0.1:8080')
})