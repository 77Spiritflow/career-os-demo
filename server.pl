#!/usr/bin/perl
use IO::Socket::INET;
$|=1;
my $port = shift || 8080;
my %ct=(html=>"text/html;charset=utf-8",css=>"text/css;charset=utf-8",js=>"application/javascript;charset=utf-8",json=>"application/json",png=>"image/png",svg=>"image/svg+xml",jpg=>"image/jpeg",ico=>"image/x-icon",webp=>"image/webp");
my $s=IO::Socket::INET->new(LocalPort=>$port,Proto=>"tcp",Listen=>5,ReuseAddr=>1) or die "BIND FAIL: $!\n";
print "🚀 http://localhost:$port/index.html\n";
while(my $c=$s->accept()){
  $c->autoflush(1);
  my $h="";my $b;
  while(1){recv($c,$b,1,0) or last;$h.=$b;last if $h=~/\r\n\r\n/||length($h)>4096}
  if($h=~/^GET (\S+)/){
    my $p=$1;$p=~s/\?.*//;$p="/index.html" if $p eq "/";
    my $f="/workspace$p";$f=~s/\.\./_/g;
    if(-f $f && -r $f && open(my $fh,"<:raw",$f)){
      my $d=do{local $/;<$fh>};close $fh;
      my $e=($f=~/\.(\w+)$/)[0]||"txt";
      my $t=$ct{lc$e}||"application/octet-stream";
      print $c "HTTP/1.1 200\r\nContent-Type:$t\r\nContent-Length:".length($d)."\r\nConnection:close\r\n\r\n$d";
    }else{
      print $c "HTTP/1.1 404\r\nContent-Length:0\r\nConnection:close\r\n\r\n";
    }
  }
  close$c;
}
