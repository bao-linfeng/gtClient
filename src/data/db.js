const data = {
    data:[
        {
            id: 1,
            title: '明天要去打酱油',
            content: '系呀系呀我们一起打酱油'
        },
        {
            id: 2,
            title: '周末去书吧读书',
            content: '书籍是人类进步的阶梯'
        },
        {
            id: 3,
            title: '备份一下数据库',
            content: '备份服务器的数据库，一般都是分开的，分布式数据库'
        },
        {
            id: 4,
            title: '周五记得把被子洗了',
            content: '洗杯子被子被子被子'
        },
        {
            id: 5,
            title: '计划五',
            content: '计划五内容'
        }
    ],
    linkPage_nav:[
        {title:'谱牒文化',content_1:'从几万种家谱中，快速发现你',content_2:'感兴趣的家谱',url:'/genealogyDatabase'},
        {title:'姓氏资料库',content_1:'发现315个姓氏背后的秘密，',content_2:'找到姓氏的故事渊源',url:'/surnameDatabase'},
        {title:'姓氏源流',content_1:'家族迁徙路线，一目了然，',content_2:'原来你的祖先在这里',url:'/surnameRoot'},
        {title:'专家咨询',content_1:'取得家谱相关问题的',content_2:'免费个人协助',url:'/expertConsultation'},
        {title:'家族空间',content_1:'不论在咫尺或天涯，创造一份',content_2:'共赏的家谱瑰宝，其实很简单',url:'/familySpace'}
    ],
    header_nav:[
        {title:'首页',url:'/'},
        {title:'谱牒文化',url:'/genealogyDatabase'},
        {title:'姓氏源流',url:'/surnameRoot'},
        {title:'专家咨询',url:'/expertConsultation'},
        {title:'百科',url:'/encyclopedia'},
        {title:'新闻资讯',url:'/news'},
        {title:'登录',url:'/login'},
        {title:'注册',url:'/register'}
    ],
    header_nav_user:[
        {title:'用户名:',url:'/'},
        {title:'个人资料',url:'/userInfo'},
        {title:'消息推送',url:'/message'},
        {title:'我的亲友',url:'/relativeFriend'},
        {title:'家族空间',url:'/familySpace'},
        {title:'家谱书签',url:'/'},
        {title:'我的家谱',url:'/myGenealogy'},
        {title:'家谱捐赠',url:'/myDonation'},
        {title:'我的咨询',url:'/myExpertConsultation'},
        {title:'我的日志',url:'/myLog'},
        {title:'我的收藏',url:'/myCollection'},
        {title:'推荐阅读',url:'/'},
    ],
    user_left_nav:[
        {title:'个人资料',url:'/userInfo'},
        {title:'家族空间',url:'/familySpace'},
        {title:'家谱书签',url:'/myBook'},
        {title:'我的家谱',url:'/myGenealogy'},
        {title:'我的捐赠',url:'/myDonation'},
        {title:'我的咨询',url:'/myExpertConsultation'},
        {title:'我的日志',url:'/myLog'},
        {title:'我的收藏',url:'/myCollection'},
        {title:'推荐阅读',url:'/'},
        {title:'新闻资讯',url:'/addNews'},
        {title:'家谱审核',url:'/checkGenealogy'},
        {title:'家谱列表',url:'/genealogyList'}
    ],
    genealogyDatabase:[
        {title:'族谱资料库',url:'/genealogyDatabase'},
        {title:'姓氏资料库',url:'/surnameDatabase'},
        {title:'名人资料库',url:'/celebrityDatabase'}
    ],
    charSet:['A','B','C','D','E','F','J','H','I','K','L','M','N','O','P','Q','R','S','T','W','X','Y','Z'],
    expertConsultationTab:[
        {name:'全部',type:0},
        {name:'家谱',type:1},
        {name:'寻根',type:2},
        {name:'委托查询',type:3},
        {name:'文献复制',type:4},
        {name:'阅读服务',type:5}
    ]
}

export default data