<template>
  <view class="user-page">
    <view v-if="title == '用户协议'">
      <div class="container">
        <header>
          <view class="title">用户协议</view>
          <div class="subtitle">请仔细阅读并理解本用户协议</div>
        </header>

        <div class="agreement-content">
          <p>欢迎您使用本小程序！本小程序由通达微波（以下简称"我们"）开发并运营。在您使用本小程序之前，请仔细阅读本《用户协议》（以下简称"本协议"）。</p>

          <view class="sub-title">一、协议的接受与修改</view>
          <p>1.1 您在使用本小程序服务前，需要完全同意本协议及相关规范标准。如您不同意本协议，请立即停止使用本小程序。</p>
          <p>1.2 我们有权根据需要不时地修改本协议，并在小程序内公布。修改后的协议一经公布即有效替代原有协议。如您继续使用本小程序，则视为您已接受修改后的协议。</p>

          <view class="sub-title">二、账号注册与使用</view>
          <p>2.1 您可能需要注册账号才能使用本小程序的部分功能。您承诺提供真实、准确、完整的注册信息。</p>
          <p>2.2 您有责任妥善保管账号及密码，并对使用该账号进行的所有活动承担责任。</p>
          <p>2.3 如发现任何未经授权使用您账号的情况，请立即通知我们。</p>

          <view class="sub-title">三、用户行为规范</view>
          <p>3.1 您在使用本小程序时，必须遵守中华人民共和国相关法律法规，并同意：</p>
          <ul>
            <li>不利用本小程序从事任何非法活动；</li>
            <li>不发布、传播任何违法、侵权或虚假信息；</li>
            <li>不干扰或破坏本小程序的正常运营；</li>
            <li>不侵犯他人知识产权、商业秘密等合法权益；</li>
            <li>不从事其他违反法律法规或社会公德的行为。</li>
          </ul>

          <view class="sub-title">四、隐私政策</view>
          <p>4.1 我们非常重视您的隐私保护，将按照相关法律法规和《隐私政策》的规定保护您的个人信息。</p>
          <p>4.2 在您使用本小程序过程中，我们可能会收集、使用、存储和共享您的个人信息，具体内容请参阅我们的《隐私政策》。</p>

          <view class="sub-title">五、知识产权</view>
          <p>5.1 本小程序的所有内容，包括但不限于文字、图形、 logos、软件等，均受著作权法、商标法等相关知识产权法律保护。</p>
          <p>5.2 未经我们明确书面授权，您不得修改、复制、传播、发行或以其他方式使用本小程序的任何内容。</p>

          <view class="sviewitle">六、免责声明</view>
          <p>6.1 本小程序按"现状"提供，我们不保证服务不会中断，也不保证服务的及时性、安全性、准确性。</p>
          <p>6.2 因不可抗力（如自然灾害、战争、政府行为等）导致的服务中断或数据丢失，我们不承担责任。</p>
          <p>6.3 您应对使用本小程序服务的结果自行承担风险。</p>

          <div class="highlight">
            <p><strong>特别提示：</strong>您理解并同意，我们有权根据业务发展需要单方面暂停、终止或变更部分或全部服务，且无需承担任何责任。</p>
          </div>

          <view class="sub-title">七、服务变更、中断或终止</view>
          <p>7.1 我们有权根据业务发展需要，暂停、中断或终止部分或全部服务。</p>
          <p>7.2 如您违反本协议，我们有权暂停或终止向您提供服务，并保留追究法律责任的权利。</p>

          <view class="sub-title">八、法律适用与争议解决</view>
          <p>8.1 本协议的订立、执行、解释及争议解决均适用中华人民共和国法律。</p>
          <p>8.2 如双方就本协议内容或其执行发生争议，应首先友好协商解决；协商不成的，任何一方均有权向我们所在地有管辖权的人民法院提起诉讼。</p>

          <view class="sub-title">九、其他条款</view>
          <p>9.1 本协议构成您与我们之间就使用本小程序服务的完整协议。</p>
          <p>9.2 如本协议的任何条款被认定为无效或不可执行，不影响其他条款的效力。</p>
          <p>9.3 我们的不作为或不执行本协议权利不构成对相关权利的放弃。</p>

          <div class="footer">
            <p>感谢您阅读本用户协议！</p>
            <div class="company-info">
              <p>更新日期：2025年08月25日</p>
            </div>
          </div>
        </div>
      </div>
    </view>

    <view v-else>
      <div class="container">
        <header>
          <view class="title">隐私协议</view>
          <div class="subtitle">请仔细阅读并理解本隐私协议，我们将严格按照本协议保护您的个人信息</div>
        </header>

        <div class="privacy-content">
          <p>通达微波（以下简称"我们"）非常重视用户的隐私保护，因此制定了本《隐私协议》（以下简称"本协议"）。本协议将帮助您了解以下内容：</p>

          <view class="sub-title">一、引言</view>
          <p>
            我们深知个人信息对您的重要性，并会尽全力保护您的个人信息安全可靠。我们致力于维持您对我们的信任，恪守以下原则，保护您的个人信息：权责一致原则、目的明确原则、选择同意原则、最少够用原则、确保安全原则、主体参与原则、公开透明原则等。
          </p>

          <view class="sub-title">二、我们如何收集和使用您的个人信息</view>
          <p>个人信息是指以电子或者其他方式记录的能够单独或者与其他信息结合识别特定自然人身份或者反映特定自然人活动情况的各种信息。</p>

          <view class="small-title">1. 我们收集的个人信息</view>
          <p>在您使用本小程序服务的过程中，我们会按照如下方式收集您在使用服务时主动提供或因为使用服务而产生的信息，用以向您提供服务、优化我们的服务以及保障您的账号安全：</p>
          <ul>
            <li><strong>账号信息：</strong>当您注册本小程序时，我们会收集您的微信昵称、头像等信息。</li>
            <li><strong>设备信息：</strong>我们会根据您在软件安装及使用中授予的具体权限，接收并记录您所使用的设备相关信息。</li>
            <li><strong>服务日志信息：</strong>当您使用我们的网站或客户端提供的产品或服务时，我们会自动收集您对我们服务的详细使用情况，作为服务日志保存。</li>
            <li><strong>位置信息：</strong>当您使用与位置有关的服务时，我们可能会记录您设备所在的位置信息。</li>
          </ul>

          <view class="small-title">2. 我们如何使用您的个人信息</view>
          <p>我们严格遵守法律法规的规定及与用户的约定，将收集的信息用于以下用途：</p>
          <ul>
            <li>向您提供服务；</li>
            <li>满足您的个性化需求；</li>
            <li>产品开发和服务优化；</li>
            <li>安全保障；</li>
            <li>管理软件；</li>
            <li>邀请您参与有关我们服务的调查。</li>
          </ul>

          <view class="sub-title">三、我们如何使用Cookie和同类技术</view>
          <p>为使您获得更轻松的访问体验，您使用本小程序服务时，我们可能会通过小型数据文件识别您的身份，这么做可帮您省去重复输入注册信息的步骤，或者帮助判断您的账号安全。</p>

          <view class="sub-title">四、我们共享、转让、公开披露您的个人信息</view>
          <view class="small-title">1. 共享</view>
          <p>我们不会与任何公司、组织和个人分享您的个人信息，但以下情况除外：</p>
          <ul>
            <li>在获取明确同意的情况下共享；</li>
            <li>根据法律法规规定，或按政府主管部门的强制性要求；</li>
            <li>与授权合作伙伴共享。</li>
          </ul>

          <view class="small-title">2. 转让</view>
          <p>我们不会将您的个人信息转让给任何公司、组织和个人，但以下情况除外：</p>
          <ul>
            <li>在获取明确同意的情况下转让；</li>
            <li>随着我们业务的持续发展，我们有可能进行合并、收购、资产转让等交易；</li>
            <li>根据适用的法律法规、法律程序的要求、强制性的行政或司法要求。</li>
          </ul>

          <view class="small-title">3. 公开披露</view>
          <p>我们仅会在以下情况下，公开披露您的个人信息：</p>
          <ul>
            <li>获得您明确同意后；</li>
            <li>基于法律的披露：在法律、法律程序、诉讼或政府主管部门强制性要求的情况下。</li>
          </ul>

          <div class="highlight">
            <p><strong>重要提示：</strong>我们不会向任何第三方提供、出售、出租、分享或交易您的个人信息，除非事先得到您的许可。</p>
          </div>

          <view class="sub-title">五、我们如何保护您的个人信息</view>
          <p>我们已使用符合业界标准的安全防护措施保护您提供的个人信息，防止数据遭到未经授权访问、公开披露、使用、修改、损坏或丢失。</p>

          <view class="sub-title">六、您的权利</view>
          <p>按照中国相关的法律、法规、标准，以及其他国家、地区的通行做法，我们保障您对自己的个人信息行使以下权利：</p>
          <ul>
            <li><strong>访问您的个人信息：</strong>您有权访问您的个人信息，法律法规规定的例外情况除外。</li>
            <li><strong>更正您的个人信息：</strong>当您发现我们处理的关于您的个人信息有错误时，您有权要求我们做出更正。</li>
            <li><strong>删除您的个人信息：</strong>在以下情形中，您可以向我们提出删除个人信息的请求。</li>
            <li><strong>改变您授权同意的范围：</strong>每个业务功能需要一些基本的个人信息才能得以完成。</li>
            <li><strong>个人信息主体注销账户：</strong>您随时可注销此前注册的账户。</li>
            <li><strong>约束信息系统自动决策：</strong>在某些业务功能中，我们可能仅依据信息系统、算法等在内的非人工自动决策机制做出决定。</li>
          </ul>

          <view class="sub-title">七、我们如何处理儿童的个人信息</view>
          <p>我们的产品、网站和服务主要面向成人。如果没有父母或监护人的同意，儿童不得创建自己的用户账户。</p>

          <view class="sub-title">八、人信息如何在全球范围转移</view>
          <p>我们在中华人民共和国境内运营中收集和产生的个人信息，存储在中国境内，以下情形除外：</p>
          <ul>
            <li>法律法规有明确规定；</li>
            <li>获得您的明确授权。</li>
          </ul>

          <view class="sub-title">九、本协议如何更新</view>
          <p>我们的隐私协议可能变更。未经您明确同意，我们不会削减您按照本隐私协议所应享有的权利。</p>
          <div class="footer">
            <div class="company-info">
              <p>更新日期：2025年8月24日</p>
            </div>
          </div>
        </div>
      </div>
    </view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      user: ``,
      privacy: '',
      content: '',
      title: ''
    }
  },
  onLoad(param) {
    const title = this.title = param.title

    uni.setNavigationBarTitle({
      title
    })
    // if(title === '用户协议') {
    //   this.content = this.user
    // } else {
    //   this.content = this.privacy
    // }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.user-page {
  .container {
    max-width: 800px;
    margin: 0 auto;
    background: white;
    border-radius: 12px;
    box-shadow: 0 2px 20px rgba(0, 0, 0, 0.08);
    padding: 30px;
  }

  header {
    text-align: center;
    margin-bottom: 30px;
    padding-bottom: 20px;
    border-bottom: 1px solid #eee;
  }

  .title {
    margin: 20rpx 0;
    font-size: 22px;
    color: #07C160;
  }

  .subtitle {
    color: #666;
    font-size: 14px;
  }

  .agreement-content {
    font-size: 14px;
  }

  .sub-title {
    font-size: 16px;
    color: #07C160;
    margin: 20px 0 10px;
    padding-left: 10px;
    border-left: 3px solid #07C160;
  }

  .sub-title {
    font-size: 15px;
    margin: 15px 0 8px;
    color: #333;
  }

  p {
    margin-bottom: 12px;
    text-align: justify;
  }

  ul,
  ol {
    margin: 10px 0 15px 20px;
  }

  li {
    margin-bottom: 8px;
  }

  .highlight {
    background-color: #f9f9f9;
    padding: 15px;
    border-radius: 6px;
    border-left: 3px solid #07C160;
    margin: 15px 0;
  }

  .footer {
    margin-top: 30px;
    text-align: right;
    font-size: 13px;
    color: #999;
  }

  .company-info {
    margin-top: 10px;
  }
}
</style>
