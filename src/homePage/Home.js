import React from 'react';
import Layout from '../views/Layout';
import { Link } from 'router1-react';

function Home() {
  return (
    <Layout>
      <ul>
        <li><Link route="home" hash="p1">p1</Link></li>
        <li><Link route="home" hash="p3">p3</Link></li>
        <li><Link route="home" hash="p5">p5</Link></li>
        <li><Link route="home" hash="p7">p7</Link></li>
        <li><Link route="home" hash="p11">p11</Link></li>
        <li><a href="#p11">p11</a></li>
        <li><Link route="home" hash="p13">p13</Link></li>
      </ul>
      <p id="p1">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer diam felis, fringilla in nibh sed, gravida
        commodo ipsum. Nullam hendrerit et nisi quis efficitur. Sed convallis tristique vestibulum. Etiam placerat
        tempor leo, et dapibus enim tristique posuere. Phasellus faucibus maximus pellentesque. Nunc varius finibus
        diam, egestas scelerisque lectus vehicula a. Quisque non accumsan felis.
      </p>
      <p>
        Quisque commodo lorem nec velit lobortis eleifend. Donec volutpat nunc quis scelerisque iaculis. Cras vitae
        ullamcorper ipsum. Pellentesque sit amet ligula nunc. Vivamus eu dui quis leo rhoncus sodales. Nullam iaculis,
        mauris sit amet tempus interdum, mauris sapien ullamcorper urna, bibendum laoreet lorem massa dignissim sem.
        Phasellus posuere et nisi vitae condimentum. Mauris vehicula dapibus porta. Ut at aliquet tellus, egestas
        pretium eros. Morbi aliquet nulla ultricies, blandit purus eu, interdum ipsum.
      </p>
      <p id="p3">
        <b>p3</b>
        Interdum et malesuada fames ac ante ipsum primis in faucibus. Sed a libero pellentesque enim eleifend maximus
        vitae eu libero. Quisque sed dui auctor, malesuada magna id, ullamcorper turpis. Etiam id augue accumsan,
        iaculis dolor sit amet, viverra justo. Nam non tincidunt metus. Maecenas volutpat pulvinar enim id aliquam.
        Maecenas rutrum in mauris ac mollis. Fusce enim ligula, tempor sit amet felis eu, auctor ornare augue. Integer
        eu libero aliquam, bibendum sem id, dapibus augue.
      </p>
      <p>
        Nullam molestie odio ipsum, pretium tincidunt velit gravida ut. Integer tincidunt sem sed aliquam
        pellentesque. Praesent nisi sapien, lobortis vel elementum vitae, elementum at metus. Vivamus quis ante mi.
        Sed nunc mauris, bibendum fringilla hendrerit id, posuere sit amet felis. Fusce eget ex mattis, sagittis metus
        ut, semper justo. Praesent pharetra lorem a rutrum suscipit. Nullam pharetra sed elit id vehicula.
      </p>
      <p id="p5">
        <b>p5</b>
        Nulla nec dui aliquam, maximus lectus nec, faucibus nisl. In hendrerit vitae sapien sed feugiat. Nunc in
        lobortis elit. Morbi libero dolor, sollicitudin in finibus sit amet, feugiat sed sapien. Suspendisse molestie
        enim vel odio pharetra ornare. Sed suscipit rutrum turpis eu condimentum. Quisque sed metus ultricies,
        porttitor lectus vel, fringilla metus. Nullam vehicula nibh purus.
      </p>
      <p>
        Fusce ut tempus justo, eu pellentesque augue. Nam mollis feugiat lacus, et lacinia ligula ultricies eget.
        Phasellus molestie ornare tempus. Donec posuere ligula in posuere luctus. Aliquam eleifend nunc ac porttitor
        bibendum. Ut at faucibus libero. Mauris suscipit felis ipsum, eu finibus tortor pellentesque in. Pellentesque
        eu leo sapien.
      </p>
      <p id="p7">
        <b>p7</b>
        Nullam dictum risus ut erat convallis rutrum. Etiam est lectus, tempus non tincidunt non, vulputate vel nisl.
        Aenean ut suscipit eros, in malesuada ipsum. Nunc eget volutpat dui, dignissim tempor mauris. Pellentesque
        tincidunt tincidunt quam et aliquet. Curabitur pharetra sem id risus efficitur, eget sagittis magna viverra.
        Vivamus lobortis, nibh non faucibus convallis, eros sem iaculis felis, at auctor erat lorem ac lectus. Vivamus
        et mi convallis, scelerisque mi quis, iaculis turpis. Aliquam et imperdiet sem, et euismod justo.
      </p>
      <p>
        Quisque eget mi quis erat consequat sagittis et a lorem. Mauris vel vehicula quam. Sed non augue id lacus
        pulvinar dictum. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices posuere cubilia Curae;
        Phasellus rutrum nisl mollis enim commodo hendrerit. Vivamus varius condimentum arcu id sodales. Donec id
        justo gravida, finibus lectus eu, commodo mi.
      </p>
      <p>
        Vivamus erat odio, blandit sit amet mollis a, ultricies eu tortor. Ut eleifend volutpat diam sit amet
        facilisis. Donec in tempor lectus. Cras dui massa, volutpat id urna id, consequat mollis urna. Vestibulum
        ornare euismod metus, sit amet facilisis erat venenatis viverra. Ut sed eros et urna rhoncus maximus.
        Suspendisse id interdum diam. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac
        turpis egestas. Sed rhoncus, nibh in dictum rutrum, neque augue iaculis eros, ac blandit mi elit vitae metus.
        Fusce facilisis augue diam, sit amet malesuada eros porttitor at. Integer pharetra semper felis, eu
        ullamcorper neque. Aliquam erat volutpat.
      </p>
      <p>
        Pellentesque id elementum tortor. Sed ullamcorper blandit dui, in consectetur nibh pretium in. Pellentesque
        habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Cras non orci nisl.
        Vestibulum nisi nunc, rhoncus eu nisi et, viverra sagittis neque. Praesent sit amet laoreet orci, sit amet
        consectetur lorem. In vitae venenatis dui. Duis eget orci luctus, euismod orci id, suscipit felis.
      </p>
      <p id="p11">
        <b>p11</b>
        Integer libero urna, eleifend non ultricies et, pretium sit amet massa. Vestibulum ante ipsum primis in
        faucibus orci luctus et ultrices posuere cubilia Curae; Cum sociis natoque penatibus et magnis dis parturient
        montes, nascetur ridiculus mus. Donec sit amet sollicitudin urna. Nulla in nulla eu urna consectetur
        porttitor. Cras sed tortor efficitur, gravida sapien sit amet, tristique metus. Nullam purus odio, placerat
        sed lorem vel, accumsan ultricies dui. Nulla rutrum massa porttitor, malesuada arcu vel, elementum enim.
        Praesent sit amet arcu purus. Nullam fermentum nisi odio, ac mollis quam vehicula vitae. Sed scelerisque
        posuere vehicula. Praesent est orci, interdum vitae diam et, auctor sagittis massa.
      </p>
      <p>
        In velit ipsum, placerat vel leo vel, interdum interdum velit. Suspendisse in orci et tortor venenatis
        laoreet. Maecenas vel augue id dolor iaculis pellentesque. Phasellus sagittis, mi id pretium suscipit, dui
        erat gravida metus, sit amet rutrum massa turpis sed lacus. Pellentesque aliquet sem ligula, ut condimentum
        nisi feugiat non. Mauris non consequat ligula, eget egestas est. Vestibulum ante ipsum primis in faucibus orci
        luctus et ultrices posuere cubilia Curae; Etiam venenatis gravida lacus. Etiam pulvinar, quam in placerat
        tempus, purus ligula vulputate mauris, quis egestas metus justo ac nibh. Proin ante dolor, tincidunt sit amet
        convallis in, pretium non urna. Nam sem lacus, lacinia et cursus in, eleifend a nisl.
      </p>
      <p id="p13">
        <b>p13</b>
        Sed ac quam ac ex molestie bibendum vitae nec nulla. Praesent vitae finibus enim. Ut eu quam nec nulla
        consectetur mollis. Vivamus ornare dui quis massa tempus tincidunt. Proin varius lacinia quam id molestie.
        Donec vel posuere dolor, ac congue velit. Vivamus in purus sapien. Donec semper pellentesque est, id rhoncus
        ante iaculis eu. Integer elit augue, bibendum id lorem a, fringilla lobortis dolor. Sed sit amet eros
        elementum, dictum urna quis, blandit ligula. Vestibulum ante ipsum primis in faucibus orci luctus et ultrices
        posuere cubilia Curae; Vestibulum et est nec quam venenatis ultrices. Nullam a neque porttitor nisl pretium
        dapibus at eget orci. Aenean eu commodo neque, eget tincidunt odio. Cras porttitor vestibulum velit, nec
        pulvinar tellus vestibulum nec. Vivamus maximus vehicula mi, eget rhoncus mauris pharetra a.
      </p>
      <p>
        Cras lobortis, elit nec tempus sollicitudin, est nulla tristique arcu, fermentum vestibulum nulla elit sit
        amet sapien. Phasellus consectetur pellentesque nunc nec imperdiet. Aliquam mattis consequat ipsum eu
        volutpat. In aliquet est dolor, eget porttitor nibh elementum ac. Donec elementum blandit ante, ut ultricies
        arcu aliquam vel. Quisque non ullamcorper dolor. Sed malesuada justo ut nulla ultrices, sit amet sollicitudin
        nulla egestas. Ut scelerisque eu leo in tempus. Morbi egestas lorem et eros tristique, quis lacinia tortor
        laoreet. Fusce accumsan justo eget finibus sagittis. Nullam mattis massa metus, eu fermentum turpis porta nec.
      </p>
      <p>
        Donec quis vulputate orci. In pharetra purus vel purus rutrum, non viverra neque tincidunt. Pellentesque
        scelerisque velit eu augue congue, sed euismod nisi congue. Donec viverra nulla scelerisque, feugiat metus
        vel, auctor dui. Nunc tempus, elit id auctor lobortis, neque elit egestas quam, vel efficitur metus ligula sed
        eros. Cras faucibus venenatis enim vitae ultrices. Proin purus urna, gravida quis bibendum eget, vehicula at
        risus. In hac habitasse platea dictumst. Aenean dui ligula, vehicula eget placerat venenatis, molestie ut
        diam. Curabitur condimentum sollicitudin metus at sodales. Donec ac mi urna. Vestibulum dictum urna felis, in
        rutrum erat tristique sed. Mauris consequat neque sed dui cursus molestie. Ut augue nisi, volutpat ac mollis
        in, imperdiet at diam. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos
        himenaeos.
      </p>
    </Layout>
  );
}

export default Home;
