
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
	<link rel="stylesheet" href="css/Selectyze.jquery.css" type="text/css" />
	
	<style type="text/css">
		*{margin:0;padding:0}
		body{margin:20px;font-family:Arial}
		fieldset{padding:20px}
		p.intro {padding:10px;background-color:#222222;color:#afafaf;margin-top:50px;width:350px}
		.intro span {color:#ff0000}
		.first {margin-top:0 !important}
		.clr {clear:both;}
		input.submit{margin-top:30px;padding:15px}
		label {float:left;display:block;margin-right:20px;margin-top:25px}
		p.code {padding:10px;background-color:#f0f0f0;border:1px solid #cecece;width:450px;margin-bottom:20px}
		fieldset{border:0}
	</style>
</head>

<body>
<ul>
	<li>Full documentation on <a href="http://www.myjqueryplugins.com/Selectyze">MyjQueryPlugins.com/Selectyze</a></li>
	<li>Live demonstration on <a href="http://www.myjqueryplugins.com/Selectyze/demo">Selectyze demonstration page</a></li>
</ul>
<h1>Selectyze plugin</h1>
<?php
if(isset($_POST['btValide']))
{
echo '<p class="code">';
	echo 'Datas receive after submit form :<br />';
	echo '#1 -> '.$_POST['style1'].'<br />';
	echo '#2 -> '.$_POST['style2'].'<br />';
	echo '#3 -> '.$_POST['style3'].'<br />';
	echo '#4 -> '.$_POST['style4'].'<br />';
	echo '#5 -> '.$_POST['style5'].'<br />';
	echo '</p>';
}
?>
	<form method="post" action="">
		<fieldset>
			
			<p class="intro first">#1 -> $('.selectyze1').Selectyze({ theme : <span>'skype'</span>});</p>
			<label>State</label>
			<select name="style1" class="selectyze1">
				<option>- -</option>
				<optgroup label="States : optgroup detected !">
					<option value="Alabama" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Alabama') echo 'selected="selected"';?>>Alabama</option>
					<option value="Alaska" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Alaska') echo 'selected="selected"';?>>Alaska</option>
					<option value="Arizona" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Arizona') echo 'selected="selected"';?>>Arizona</option>
					<option value="Arkansas" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Arkansas') echo 'selected="selected"';?>>Arkansas</option>
					<option value="California" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'California') echo 'selected="selected"';?>>California</option>
				</optgroup>
				
				<optgroup label="States : optgroup detected !">
					<option value="Alabama" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Alabama') echo 'selected="selected"';?>>Alabama</option>
					<option value="Alaska" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Alaska') echo 'selected="selected"';?>>Alaska</option>
					<option value="Arizona" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Arizona') echo 'selected="selected"';?>>Arizona</option>
					<option value="Arkansas" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'Arkansas') echo 'selected="selected"';?>>Arkansas</option>
					<option value="California" <?php if(isset($_POST['style1']) && $_POST['style1'] == 'California') echo 'selected="selected"';?>>California</option>
				</optgroup>
					
			</select>
			
			
			<div class="clr"></div>
			
				
			
			<p class="intro">#2 -> $('.selectyze2').Selectyze({ theme : <span>'mac'</span>});</p>
			<label>State</label>
			<select name="style2" class="selectyze2">
				<option>- -</option>
				<optgroup label="States">
					<option value="Alabama" <?php if(isset($_POST['style2']) && $_POST['style2'] == 'Alabama') echo 'selected="selected"';?>>Alabama</option>
					<option value="Alaska" <?php if(isset($_POST['style2']) && $_POST['style2'] == 'Alaska') echo 'selected="selected"';?>>Alaska</option>
					<option value="Arizona" <?php if(isset($_POST['style2']) && $_POST['style2'] == 'Arizona') echo 'selected="selected"';?>>Arizona</option>
					<option value="Arkansas" <?php if(isset($_POST['style2']) && $_POST['style2'] == 'Arkansas') echo 'selected="selected"';?>>Arkansas</option>
					<option value="California" <?php if(isset($_POST['style2']) && $_POST['style2'] == 'California') echo 'selected="selected"';?>>California</option>
				</optgroup>
			</select>
			
			
			
			<div class="clr"></div>
			
			
			<p class="intro">#3 -> $('.selectyze3').Selectyze({ theme : <span>'grey'</span>});</p>
			<label>State</label>
			<select name="style3" class="selectyze3">
				<option>- -</option>
				<optgroup label="States">
					<option value="Alabama" <?php if(isset($_POST['style3']) && $_POST['style3'] == 'Alabama') echo 'selected="selected"';?>>Alabama</option>
					<option value="Alaska" <?php if(isset($_POST['style3']) && $_POST['style3'] == 'Alaska') echo 'selected="selected"';?>>Alaska</option>
					<option value="Arizona" <?php if(isset($_POST['style3']) && $_POST['style3'] == 'Arizona') echo 'selected="selected"';?>>Arizona</option>
					<option value="Arkansas" <?php if(isset($_POST['style3']) && $_POST['style3'] == 'Arkansas') echo 'selected="selected"';?>>Arkansas</option>
					<option value="California" <?php if(isset($_POST['style3']) && $_POST['style3'] == 'California') echo 'selected="selected"';?>>California</option>
				</optgroup>
			</select>
			
			
			
			<div class="clr"></div>
			
			
			<p class="intro">#4 -> $('.selectyze4').Selectyze({ theme : <span>'firefox'</span>});</p>
			<label>State</label>
			<select name="style4" class="selectyze4">
				<option>- -</option>
				<optgroup label="States">
					<option value="Alabama" <?php if(isset($_POST['style4']) && $_POST['style4'] == 'Alabama') echo 'selected="selected"';?>>Alabama</option>
					<option value="Alaska" <?php if(isset($_POST['style4']) && $_POST['style4'] == 'Alaska') echo 'selected="selected"';?>>Alaska</option>
					<option value="Arizona" <?php if(isset($_POST['style4']) && $_POST['style4'] == 'Arizona') echo 'selected="selected"';?>>Arizona</option>
					<option value="Arkansas" <?php if(isset($_POST['style4']) && $_POST['style4'] == 'Arkansas') echo 'selected="selected"';?>>Arkansas</option>
					<option value="California" <?php if(isset($_POST['style4']) && $_POST['style4'] == 'California') echo 'selected="selected"';?>>California</option>
				</optgroup>
			</select>
			<div class="clr"></div>
			
			<p class="intro">#5 -> $('.selectyze5').Selectyze({ theme : <span>'css3'</span>});</p>
			<label>State</label>
			<select name="style5" class="selectyze5">
				<option>- -</option>
				<optgroup label="States">
					<option value="Alabama" <?php if(isset($_POST['style5']) && $_POST['style5'] == 'Alabama') echo 'selected="selected"';?>>Alabama</option>
					<option value="Alaska" <?php if(isset($_POST['style5']) && $_POST['style5'] == 'Alaska') echo 'selected="selected"';?>>Alaska</option>
					<option value="Arizona" <?php if(isset($_POST['style5']) && $_POST['style5'] == 'Arizona') echo 'selected="selected"';?>>Arizona</option>
					<option value="Arkansas" <?php if(isset($_POST['style5']) && $_POST['style5'] == 'Arkansas') echo 'selected="selected"';?>>Arkansas</option>
					<option value="California" <?php if(isset($_POST['style5']) && $_POST['style5'] == 'California') echo 'selected="selected"';?>>California</option>
				</optgroup>
			</select>
			<div class="clr"></div>
			
			<input type="submit" value="send" name="btValide" class="submit" />
		</fieldset>
	</form>


	<script type="text/javascript" src="jquery/jquery.js"></script>
	<script type="text/javascript" src="jquery/Selectyze.jquery.min.js"></script>
	<script type="text/javascript">
		$(document).ready(function(){
			$('.selectyze1').Selectyze({
				theme : 'skype'
			});
			
			$('.selectyze2').Selectyze({
				theme : 'mac'
			});
			
			$('.selectyze3').Selectyze({
				theme : 'grey'
			});	
			
			$('.selectyze4').Selectyze({
				theme : 'firefox'
			});
			
			$('.selectyze5').Selectyze({
				theme : 'css3'
			});
			
		});
	</script>
</body>
</html>
