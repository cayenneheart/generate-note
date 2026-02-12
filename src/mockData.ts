import type {
  PipelineStep,
  GenerationResult,
} from './types';

export const PIPELINE_STEPS: PipelineStep[] = [
  { id: 1, name: 'リサーチ', description: 'キーワード調査・検索意図分析', duration: 5, status: 'waiting', icon: '🔍' },
  { id: 2, name: 'SEO分析', description: 'タイトル・見出し・FAQ構築', duration: 8, status: 'waiting', icon: '📊' },
  { id: 3, name: '構成作成', description: '記事構成の作成', duration: 8, status: 'waiting', icon: '📝' },
  { id: 4, name: '記事執筆', description: '自然な日本語での記事生成', duration: 25, status: 'waiting', icon: '✍️' },
  { id: 5, name: 'ファクトチェック', description: '事実情報の自動検証', duration: 8, status: 'waiting', icon: '✅' },
  { id: 6, name: '画像生成', description: 'アイキャッチ+記事内画像', duration: 15, status: 'waiting', icon: '🎨' },
  { id: 7, name: '図解生成', description: 'Mermaid図解の自動作成', duration: 5, status: 'waiting', icon: '📈' },
  { id: 8, name: 'X告知文', description: 'SNS投稿文の作成', duration: 7, status: 'waiting', icon: '📣' },
  { id: 9, name: '出力', description: '全データの統合', duration: 2, status: 'waiting', icon: '📦' },
];

export function generateMockResult(keyword: string): GenerationResult {
  return {
    seoAnalysis: {
      searchIntent: `「${keyword}」に関する基本的な情報を求める検索意図。初心者向けの解説記事が有効。`,
      relatedKeywords: [
        `${keyword} 使い方`,
        `${keyword} 初心者`,
        `${keyword} おすすめ`,
        `${keyword} メリット デメリット`,
        `${keyword} 始め方`,
      ],
      competitorInsights: `上位記事は平均5,000〜8,000文字。具体的な手順解説と体験談が上位にランクイン。`,
    },
    structure: {
      title: `【2025年最新】${keyword}とは？初心者が挫折しない使い方を実体験と失敗談から徹底解説！`,
      headings: [
        { level: 2, text: `${keyword}とは？自由な発想を形にする魔法のノートアプリ` },
        { level: 3, text: `${keyword}の基本的な特徴` },
        { level: 3, text: 'なぜ今注目されているのか' },
        { level: 2, text: `${keyword}を使い始める前に知っておきたいこと` },
        { level: 3, text: '向いている人・向いていない人' },
        { level: 3, text: '他のツールとの違い' },
        { level: 2, text: '実際に使ってみた体験談' },
        { level: 3, text: '最初の1週間で感じたこと' },
        { level: 3, text: 'つまずいたポイントと解決法' },
        { level: 2, text: 'よくある質問' },
      ],
      faq: [
        { question: `${keyword}は無料で使えますか？`, answer: `はい、${keyword}の基本機能は無料で利用できます。一部のプラグインやSync機能は有料ですが、無料版でも十分に活用できます。` },
        { question: '初心者でも使いこなせますか？', answer: 'はい。最初はシンプルなメモから始めて、慣れてきたら少しずつ機能を覚えていくのがおすすめです。' },
        { question: 'スマホでも使えますか？', answer: 'はい、iOS・Android両方に対応しています。PC版との同期も可能です。' },
      ],
      metaDescription: `2025年最新の${keyword}完全ガイド。初心者が挫折しない使い方を、実体験と失敗談を交えて徹底解説。メリット・デメリットから活用術まで、あなたの生産性を劇的に向上させるコツが満載です。`,
    },
    article: {
      title: `【2025年最新】${keyword}とは？初心者が挫折しない使い方を実体験と失敗談から徹底解説！`,
      author: '執筆者',
      date: new Date().toLocaleDateString('ja-JP', { year: 'numeric', month: 'long', day: 'numeric' }),
      readingTime: '12分',
      heroImage: '',
      content: generateArticleContent(keyword),
      contentMarkdown: generateArticleMarkdown(keyword),
    },
    diagrams: [
      {
        id: 'diagram-1',
        title: 'プロセスフロー',
        type: 'フローチャート・手順を視覚的に表現したフローチャート',
        description: `${keyword}の導入プロセス`,
        mermaidCode: `flowchart TD
    A["インストール"] --> B["初期設定"]
    B --> C["最初のノート作成"]
    C --> D["リンク機能を試す"]
    D --> E["プラグインの追加"]
    E --> F["日常的に活用"]
    
    style A fill:#e8f5e9,stroke:#4caf50
    style B fill:#e3f2fd,stroke:#2196f3
    style C fill:#fff3e0,stroke:#ff9800
    style D fill:#f3e5f5,stroke:#9c27b0
    style E fill:#fce4ec,stroke:#e91e63
    style F fill:#e0f7fa,stroke:#00bcd4`,
        insertAfterParagraph: 8,
      },
      {
        id: 'diagram-2',
        title: '比較チャート',
        type: 'グラフ・ツール比較を視覚化',
        description: '主要ノートアプリの比較',
        mermaidCode: `graph LR
    A["ノートアプリ選び"] --> B["${keyword}"]
    A --> C["Notion"]
    A --> D["Evernote"]
    
    B --> B1["ローカル保存"]
    B --> B2["Markdown対応"]
    B --> B3["双方向リンク"]
    
    C --> C1["クラウドベース"]
    C --> C2["データベース機能"]
    
    D --> D1["Web Clipper"]
    D --> D2["OCR機能"]
    
    style A fill:#f5f5f5,stroke:#9e9e9e
    style B fill:#7c4dff,stroke:#651fff,color:#fff
    style C fill:#448aff,stroke:#2962ff,color:#fff
    style D fill:#69f0ae,stroke:#00e676`,
        insertAfterParagraph: 15,
      },
    ],
    factCheck: {
      totalChecked: 5,
      verified: 2,
      inaccurate: 0,
      unverified: 3,
      overallConfidence: 'medium',
      items: [
        {
          id: 'fc-1',
          claim: `${keyword}はMarkdown形式でローカルにファイルを保存するため、アプリが使えなくなっても他のテキストエディタで開いて利用できます。`,
          accuracy: 'accurate',
          confidence: 'high',
          explanation: `${keyword}はテキストファイルをローカルにMarkdown形式で保存するため、アプリが使えなくなっても他のテキストエディタで開いて利用できます。`,
          sources: [
            { title: '公式ドキュメント', url: 'https://example.com/docs', relevance: 95, date: '2025-10-15' },
            { title: '技術レビュー記事', url: 'https://example.com/review', relevance: 80, date: '2025-09-20' },
          ],
        },
        {
          id: 'fc-2',
          claim: `${keyword}の基本機能は完全無料で利用できる。`,
          accuracy: 'accurate',
          confidence: 'high',
          explanation: `${keyword}のコアアプリケーションは無料で利用可能です。Sync（月額$4）やPublish（月額$8）は有料オプションです。`,
          sources: [
            { title: '公式価格ページ', url: 'https://example.com/pricing', relevance: 98, date: '2025-11-01' },
          ],
        },
        {
          id: 'fc-3',
          claim: `2025年現在、クリエイター、研究者、ビジネスパーソン、学生といったあらゆる分野の人々から熱い注目を集めています。`,
          accuracy: 'unverified',
          confidence: 'low',
          explanation: '参照情報は主張内容を繰り返すモックデータであり、実際の検証情報が提供されていないため、真偽を判断できません。',
          sources: [],
        },
        {
          id: 'fc-4',
          claim: `プラグインは1,000以上のコミュニティプラグインが利用可能。`,
          accuracy: 'unverified',
          confidence: 'medium',
          explanation: 'プラグイン数は時期により変動するため、正確な数値の検証が必要です。',
          sources: [
            { title: 'コミュニティフォーラム', url: 'https://example.com/community', relevance: 60, date: '2025-08-10' },
          ],
        },
        {
          id: 'fc-5',
          claim: `iOS・Android両方のモバイルアプリに対応している。`,
          accuracy: 'unverified',
          confidence: 'medium',
          explanation: '公式サイトでのモバイルアプリ提供状況の確認が推奨されます。',
          sources: [],
        },
      ],
    },
    images: [
      {
        id: 'img-eyecatch',
        title: `${keyword}の世界観イメージ`,
        description: `${keyword}をテーマにした幻想的なアイキャッチ画像`,
        url: '',
        type: 'eyecatch',
      },
      {
        id: 'img-1',
        title: `${keyword}の仕組みを初心者向けに解説`,
        description: `${keyword}の仕組みを初心者向けに解説したイメージ図`,
        url: '',
        type: 'inline',
      },
      {
        id: 'img-2',
        title: `実践者の声と活用事例`,
        description: `実践者が${keyword}を活用している様子のイメージ`,
        url: '',
        type: 'inline',
      },
    ],
    xPosts: {
      recommendedTime: `${new Date().toLocaleDateString('ja-JP')} 12:00`,
      recommendedReason: '火曜・ランチタイム・エンゲージメント率高',
      shortPosts: [
        {
          id: 'sp-1',
          target: '初心者',
          content: `${keyword}って聞いたことあるけど、何から始めればいいか分からない...🤔\nそんなあなたへ、2025年最新の完全ガイドを書きました💡\n初心者が挫折しないコツ、失敗談も正直に伝えてます！`,
          hashtags: ['#' + keyword, '#ノート術', '#生産性向上'],
          tags: [keyword + '初心者', 'ノート術', '生産性'],
          charCount: 139,
          maxChars: 140,
          engagement: 'medium',
        },
        {
          id: 'sp-2',
          target: '中級者',
          content: `${keyword}をもっと効率的に使いこなしたい中級者の方へ✨\n2025年版、知らないと損するプラグインや活用法を徹底解説！\nあなたの知識管理が一段上のレベルに変わります`,
          hashtags: ['#' + keyword + '活用', '#ナレッジマネジメント', '#効率化'],
          tags: [keyword + '活用', 'プラグイン', '効率化'],
          charCount: 138,
          maxChars: 140,
          engagement: 'medium',
        },
        {
          id: 'sp-3',
          target: 'ビジネスパーソン',
          content: `ビジネスでの情報整理に${keyword}を活用したい方へ🏢\n業務効率を大幅アップさせる活用法を2025年最新情報で解説！\nナレッジ管理の新しいスタンダードを体験しませんか`,
          hashtags: ['#ビジネス効率化', '#' + keyword, '#ナレッジ管理'],
          tags: ['ビジネス効率化', keyword, 'ナレッジ管理'],
          charCount: 140,
          maxChars: 140,
          engagement: 'medium',
        },
        {
          id: 'sp-4',
          target: '主婦・主夫',
          content: `家事や育児の合間に、自分の考えを整理したい方へ📝\n${keyword}なら、隙間時間でもサクッとメモ＆ナレッジ管理ができます！\n2025年の最新活用法を優しく解説してます🌟`,
          hashtags: ['#隙間時間', '#' + keyword, '#暮らしの工夫'],
          tags: ['隙間時間', keyword, '暮らしの工夫'],
          charCount: 139,
          maxChars: 140,
          engagement: 'medium',
        },
      ],
      longPosts: [
        {
          id: 'lp-1',
          type: 'ストーリー型',
          content: `情報があちこちに散らばって、「あのメモどこだっけ？」と探し回る日々にうんざりしていませんか？🔍\n\nEvernote、Notion、Apple Notes...色々試したけど、どれもしっくりこない。「もっと効率よく、でも自由に情報を整理したい！」と願う方は少なくないはず。\n\n私もかつては、情報の迷子になることが日常茶飯事でした。そんな悩みを抱えるあなたに、ぜひ読んでいただきたいのが、今回の記事です。\n\nこの記事では、単にツールの使い方を紹介するだけでなく、「どうすれば自分の思考を最大限に活かせるのか」を、実際の利用者の体験談を交えながら、丁寧に解説しています。\n\nもう情報管理で消耗する必要はありません。新たな知識整理の道を、ぜひこの記事で見つけてみてください！\n👇\n\n#${keyword} #ナレッジ管理 #生産性向上 #情報整理 #ノートアプリ`,
          hashtags: ['#' + keyword, '#ナレッジ管理', '#生産性向上', '#情報整理', '#ノートアプリ'],
          tags: [keyword, 'ナレッジ管理', '生産性向上', '情報整理', 'ノートアプリ'],
          charCount: 480,
          engagement: 'high',
        },
      ],
      thread: {
        totalTweets: 7,
        totalChars: 1120,
        posts: [
          {
            id: 'th-1',
            number: 1,
            content: `${keyword}について知りたいけど、情報が多すぎて何から始めればいいか分からない...🤔\n\nそんな方のために、2025年最新の完全ガイドを作りました。\n\n特に初心者の方に向けて、私自身の失敗体験も含めて正直に書いてます。\n\nポイントをスレッドでまとめますね👇`,
            charCount: 160,
          },
          {
            id: 'th-2',
            number: 2,
            content: `まず結論から。\n\n${keyword}が他のツールと一線を画すのは「ローカルファイル保存」と「双方向リンク」。\n\nクラウドに依存しないから、サービス終了のリスクがない。自分のデータは自分で持つ。\n\nこれ、地味だけどめちゃくちゃ大事なポイント。`,
            charCount: 150,
          },
          {
            id: 'th-3',
            number: 3,
            content: `ただし、注意点もあります。\n\n最初は「どう使えばいいの？」と戸惑うはず。\n\n自由度が高い分、テンプレートが少ない。Notionみたいに「はい、これ使って」というガイドが薄い。\n\nだからこそ、最初の1週間の過ごし方が超重要。`,
            charCount: 145,
          },
          {
            id: 'th-4',
            number: 4,
            content: `私のおすすめの始め方。\n\n1. まずは日記から書いてみる\n2. 気になったことをメモする\n3. メモ同士をリンクで繋いでみる\n\nこの3ステップだけ。プラグインとか難しいことは後回しでOK。`,
            charCount: 130,
          },
          {
            id: 'th-5',
            number: 5,
            content: `1ヶ月続けると、面白いことが起きます。\n\n過去のメモ同士が思わぬところで繋がり始める。\n\n「あ、この考えとこの考え、関連してたんだ」と気づく瞬間がある。\n\nこれが${keyword}ならではの体験。`,
            charCount: 140,
          },
          {
            id: 'th-6',
            number: 6,
            content: `デメリットも正直に。\n\n・初期の学習コストがやや高い\n・見た目のカスタマイズに凝りすぎてしまう\n・プラグインを入れすぎると重くなる\n\nでもこれらは全部、記事で対策法を紹介してます。`,
            charCount: 135,
          },
          {
            id: 'th-7',
            number: 7,
            content: `詳しくはこちらの記事で解説しています👇\n\n初心者が挫折しないための具体的な手順、実際に使ってみた体験談、失敗から学んだことまで、全部まとめました。\n\nブックマークして、ゆっくり読んでみてください📖\n\n#${keyword} #ノート術 #生産性向上`,
            charCount: 160,
          },
        ],
      },
    },
  };
}

function generateArticleContent(keyword: string): string {
  return `<h1>【2025年最新】${keyword}とは？初心者が挫折しない使い方を実体験と失敗談から徹底解説！</h1>

<p>ノートアプリ、どれを使えばいいんだろう。${keyword}って最近よく聞くけど、なんだか難しそう。そんなふうに感じていませんか？</p>

<p>もしあなたが情報を整理したい、思考を可視化したいと考えているなら、${keyword}はあなたの強力な味方になるはずです。しかし、高機能ゆえに「どう使えばいいの？」「挫折しないかな？」といった不安を抱く方も少なくありません。</p>

<p>この記事では、${keyword}を愛用している私が、その魅力から基本的な使い方、メリット・デメリット、さらには失敗エピソードまで、2025年の最新情報と実体験を交えながら、初心者さんにも分かりやすく徹底解説します。</p>

<h2>${keyword}とは？自由な発想を形にする魔法のノートアプリ【2025年版】</h2>

<p>ひと言で言うと、${keyword}はローカル保存型のMarkdownノートアプリです。でもそれだけじゃ伝わらないですよね。</p>

<p>何が特別かって、ノート同士を「リンク」で繋げられるんです。普通のメモアプリだと、書いたメモは書いた順に並ぶだけ。${keyword}は違います。あるメモから別のメモへ、自由に線を引ける。まるで自分の頭の中をそのまま映し出すような感覚。</p>

<p>2025年現在、クリエイター、研究者、ビジネスパーソン、学生といったあらゆる分野の人々から注目を集めています。その理由は単純で、「自分だけの知識のネットワーク」を構築できるから。</p>

<h2>使い始める前に知っておきたいこと</h2>

<p>正直に言います。${keyword}は万人向けのツールではありません。</p>

<p>Notionのようにテンプレートが豊富なわけでもないし、Evernoteのように何でもクリップできるわけでもない。じゃあ何が良いのか。</p>

<p>答えは「自由度」です。自分のやりたいことに合わせて、好きなようにカスタマイズできる。プラグインを入れれば機能は無限に広がるし、見た目だってCSSで自分好みに変えられる。</p>

<p>ただし、この自由度が初心者にとっては諸刃の剣になることもある。何をどう設定すればいいか分からず、最初の壁で挫折してしまう人が多いんです。</p>

<h2>実際に使ってみた体験談</h2>

<p>私が${keyword}を使い始めたのは去年の春でした。</p>

<p>最初の1週間、正直に言うと「これ、何がいいの？」と思ってました。空っぽのエディタを前に、何を書けばいいか分からない。Notionの方がテンプレもあって楽じゃない？って。</p>

<p>でも2週間目に転機が訪れます。ある日、仕事でメモした内容と、プライベートで読んだ本の感想が思わぬところで繋がったんです。メモにリンクを張ってみたら、そこから新しいアイデアが生まれた。</p>

<p>この体験は衝撃的でした。フォルダで分類するのとは全く違う、「思考が繋がる」感覚。これが${keyword}の真価だと気づいた瞬間です。</p>

<p>万が一、${keyword}というアプリが将来的に使えなくなったとしても、あなたの書いたテキストファイルは手元に残るため、他のあらゆるテキストエディタで開いて利用できます。</p>

<h2>つまずいたポイントと解決法</h2>

<p>もちろん、失敗もたくさんしました。</p>

<p>一番大きかったのは、プラグインを入れすぎたこと。20個以上入れて、起動が遅くなり、どのプラグインが何をしているのか分からなくなった。結局、半分以上を削除して、本当に必要な5つだけに絞りました。</p>

<p>もう一つの失敗は、フォルダ構造にこだわりすぎたこと。${keyword}の良さはリンクで繋ぐことなのに、従来のファイル管理の発想が抜けなかった。「フォルダは最低限、リンクで繋ぐ」というシンプルな原則に切り替えてから、格段に使いやすくなりました。</p>

<h2>よくある質問</h2>

<p><strong>Q. ${keyword}は無料で使えますか？</strong></p>
<p>基本機能は無料で利用できます。Sync（デバイス間同期）やPublish（Web公開）は有料オプションですが、無料版でも十分に活用できます。</p>

<p><strong>Q. 初心者でも使いこなせますか？</strong></p>
<p>はい。最初はシンプルなメモから始めて、慣れてきたら少しずつ機能を覚えていくのがおすすめです。この記事で紹介した手順に沿えば、無理なく始められるはずです。</p>

<p><strong>Q. スマホでも使えますか？</strong></p>
<p>iOS・Android両方に対応しています。PC版との同期にはSync機能（有料）が必要ですが、単体でのモバイル利用は無料です。</p>`;
}

function generateArticleMarkdown(keyword: string): string {
  return `# 【2025年最新】${keyword}とは？初心者が挫折しない使い方を実体験と失敗談から徹底解説！

ノートアプリ、どれを使えばいいんだろう。${keyword}って最近よく聞くけど、なんだか難しそう。そんなふうに感じていませんか？

もしあなたが情報を整理したい、思考を可視化したいと考えているなら、${keyword}はあなたの強力な味方になるはずです。しかし、高機能ゆえに「どう使えばいいの？」「挫折しないかな？」といった不安を抱く方も少なくありません。

この記事では、${keyword}を愛用している私が、その魅力から基本的な使い方、メリット・デメリット、さらには失敗エピソードまで、2025年の最新情報と実体験を交えながら、初心者さんにも分かりやすく徹底解説します。

## ${keyword}とは？自由な発想を形にする魔法のノートアプリ【2025年版】

ひと言で言うと、${keyword}はローカル保存型のMarkdownノートアプリです。でもそれだけじゃ伝わらないですよね。

何が特別かって、ノート同士を「リンク」で繋げられるんです。普通のメモアプリだと、書いたメモは書いた順に並ぶだけ。${keyword}は違います。あるメモから別のメモへ、自由に線を引ける。まるで自分の頭の中をそのまま映し出すような感覚。

2025年現在、クリエイター、研究者、ビジネスパーソン、学生といったあらゆる分野の人々から注目を集めています。その理由は単純で、「自分だけの知識のネットワーク」を構築できるから。

## 使い始める前に知っておきたいこと

正直に言います。${keyword}は万人向けのツールではありません。

Notionのようにテンプレートが豊富なわけでもないし、Evernoteのように何でもクリップできるわけでもない。じゃあ何が良いのか。

答えは「自由度」です。自分のやりたいことに合わせて、好きなようにカスタマイズできる。プラグインを入れれば機能は無限に広がるし、見た目だってCSSで自分好みに変えられる。

ただし、この自由度が初心者にとっては諸刃の剣になることもある。何をどう設定すればいいか分からず、最初の壁で挫折してしまう人が多いんです。

## 実際に使ってみた体験談

私が${keyword}を使い始めたのは去年の春でした。

最初の1週間、正直に言うと「これ、何がいいの？」と思ってました。空っぽのエディタを前に、何を書けばいいか分からない。Notionの方がテンプレもあって楽じゃない？って。

でも2週間目に転機が訪れます。ある日、仕事でメモした内容と、プライベートで読んだ本の感想が思わぬところで繋がったんです。メモにリンクを張ってみたら、そこから新しいアイデアが生まれた。

この体験は衝撃的でした。フォルダで分類するのとは全く違う、「思考が繋がる」感覚。これが${keyword}の真価だと気づいた瞬間です。

万が一、${keyword}というアプリが将来的に使えなくなったとしても、あなたの書いたテキストファイルは手元に残るため、他のあらゆるテキストエディタで開いて利用できます。

## つまずいたポイントと解決法

もちろん、失敗もたくさんしました。

一番大きかったのは、プラグインを入れすぎたこと。20個以上入れて、起動が遅くなり、どのプラグインが何をしているのか分からなくなった。結局、半分以上を削除して、本当に必要な5つだけに絞りました。

もう一つの失敗は、フォルダ構造にこだわりすぎたこと。${keyword}の良さはリンクで繋ぐことなのに、従来のファイル管理の発想が抜けなかった。「フォルダは最低限、リンクで繋ぐ」というシンプルな原則に切り替えてから、格段に使いやすくなりました。

## よくある質問

**Q. ${keyword}は無料で使えますか？**

基本機能は無料で利用できます。Sync（デバイス間同期）やPublish（Web公開）は有料オプションですが、無料版でも十分に活用できます。

**Q. 初心者でも使いこなせますか？**

はい。最初はシンプルなメモから始めて、慣れてきたら少しずつ機能を覚えていくのがおすすめです。この記事で紹介した手順に沿えば、無理なく始められるはずです。

**Q. スマホでも使えますか？**

iOS・Android両方に対応しています。PC版との同期にはSync機能（有料）が必要ですが、単体でのモバイル利用は無料です。`;
}
