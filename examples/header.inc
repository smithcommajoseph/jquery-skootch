<!DOCTYPE html>
<html>
<head>
  <title></title>
  <link href="../common/css/style.css" type="text/css" media="screen" rel="Stylesheet" />
  <link href="../common/css/<?= $direction ?>.css" type="text/css" media="screen" rel="Stylesheet" />
  <script type="text/javascript" src="../common/js/jquery-1.5.1.min.js"></script>
  <script type="text/javascript" src="../jquery.skootch.js"></script>
</head>
<body id="<?= $direction ?>">
    <dl id="skootch-me">
        <dt id="skootch-trigger"><span>Other Configs</span></dt>
        <dd id="skootch-invader">
            <ul>
                <li><a href="right.php" id="right">Skootch Right</a></li>
                <li><a href="index.php" id="left">Skootch Left</a></li>
            </ul>
        </dd>
    </dl>
    
    <div id="main">
        <div id="header">
            <h1>jQuery Skootch</h1>
        </div>
    
        <div id="body">
            <h2>Stuff title</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>
        
            <pre class="codeblock"><span class="jQ">$</span>(<span class="sTr">"#div"</span>).skootch();</pre>
            
            <h2>Single Override</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

            <pre class="codeblock"><span class="jQ">$</span>(<span class="sTr">"#div"</span>).skootch(<span class="sTr">"direction"</span>, <span class="sTr">"right"</span>);</pre>
            
            <h2>Multiple Overrides</h2>
            <p>Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore veritatis et quasi architecto beatae vitae dicta sunt explicabo.</p>

            <pre class="codeblock"><span class="jQ">$</span>(<span class="sTr">"#div"</span>).skootch({
                    trigger: <span class="sTr">"#skootch-trigger"</span>, 
                    invader: <span class="sTr">"#skootch-invader"</span>, 
                    invaderlinks: <span class="sTr">"a.invaderlinks"</span>, 
                    advancespeed: <span class="sTr">"fast"</span>, 
                    retreatspeed: <span class="nUm">1000</span>
                });</pre>
        
        </div>
    </div>
    
    <a href="https://github.com/technicolorenvy/jquery-skootch" id="github">
        <img src="../common/imgs/forkme.png" alt="fork me on github" />
    </a>
