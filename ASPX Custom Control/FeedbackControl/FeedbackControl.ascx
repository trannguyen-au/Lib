<%@ Control Language="C#" AutoEventWireup="true" CodeBehind="FeedbackControl.ascx.cs" Inherits="COGB.WebUI.CustomControls.FeedbackControl" %>
<%@ Register TagPrefix="telerik" Namespace="Telerik.Web.UI" Assembly="Telerik.Web.UI" %>

<div id="plFeedbackControl"  runat="server">
<!-- HEADER -->
    <div id="divFeedbackHeader" runat="server" class="js feedback-control-header">
        <table class="layout-table">
        <tr>
	        <td style="width:100px;">Rate this page</td>
	        <td style="width:90px;">
	            <a alt="Bad" id="btnBad" class="rate-image" href="#"></a>
	            <a alt="Good" id="btnGood" class="rate-image" href="#" ></a>
		        <asp:TextBox ID="txtSelectedDivValue" runat="server" Style="display: none;" Text="none"></asp:TextBox>
		    </td>
	        <td  style="width:100px;">Share this page</td>
	        <td style="width:200px;">
	            <asp:HyperLink runat="server" ID="btnFacebook" CssClass="link-fb" Target="_blank"></asp:HyperLink>
	            <asp:HyperLink runat="server" ID="btnTwitter" CssClass="link-twitter" NavigateUrl="http://www.twitter.com/share" Target="_blank"></asp:HyperLink>
	            <asp:HyperLink runat="server" ID="btnMail" CssClass="link-mail" Target="_blank" ></asp:HyperLink>
	        </td>
        </tr>
        </table>
    </div>
    <!-- NO JS VERSION -->
	<div id="rateImageNoSript" class="no-js feedback-control-header" runat="server" >
	    <table class="layout-table">
        <tr>
	        <td style="width:100px;">Rate this page</td>
	        <td style="width:120px;">
	        <asp:RadioButtonList ID="rblRatings" runat="server" RepeatDirection="Horizontal">
			    <asp:ListItem Text="No" Value="No"></asp:ListItem>
			    <asp:ListItem Text="Yes" Value="Yes"></asp:ListItem>
		    </asp:RadioButtonList>
		    </td>
	        <td style="width:100px;">Share this page</td>
	        <td style="width:200px;">
	            <asp:HyperLink runat="server" Target="_blank" ID="btnFacebookNoJS" CssClass="link-fb"></asp:HyperLink>
	            <asp:HyperLink runat="server" Target="_blank" ID="btnTwitterNoJS" CssClass="link-twitter" NavigateUrl="http://www.twitter.com/share"></asp:HyperLink>
	            <asp:HyperLink runat="server" Target="_blank" ID="btnMailNoJS" CssClass="link-mail"></asp:HyperLink>
	            </td>
        </tr>
        </table>
	</div>
<!-- END HEADER -->	

<!-- BODY -->
	<div id="divShowContainer" runat="server" visible="true" class="feedback-control-body hidden">
			<div id="divTextBox">
			    <div>
			    <asp:TextBox ID="txtMessage" CssClass="msg" runat="server" Rows="2" TextMode="MultiLine"></asp:TextBox>
			    </div>
				<div>
				<asp:DropDownList ID="ddlReason" CssClass="msgReason" runat="server">		
				</asp:DropDownList>
				</div>
				
				<div>
                    <telerik:RadCaptcha ID="rCaptcha" runat="server" CaptchaTextBoxLabel="<br /> Please enter the code from the image"></telerik:RadCaptcha>
                </div>
                
                <div>
                <asp:Button ID="submit" runat="server" CssClass="buttonStyle" Text="" OnClick="submit_Click" />
                </div>
			</div>
			
		<div id="errorMsgDiv" runat="server" visible="false" class="errorMsg left">
		    <asp:BulletedList ID="errorList" runat="server"></asp:BulletedList>
		</div>
	</div>
<!-- END BODY -->

<!-- THANK YOU MESSAGE -->
	<div id="successMsgDiv" runat="server" visible="false">
		<span id="successMsg">Thank you for rating this page !</span>
	</div>
	<div id="failMsgDiv" runat="server" visible="false">
		<span id="failMsg">Sorry, You cannot rate this page twice !!</span>
	</div>
<!-- END THANK YOU MESSAGE -->

<script type="text/javascript">
    var selectionItem = "<%= txtSelectedDivValue.ClientID %>";
    var txtMessageId = "<%= txtMessage.ClientID %>";

    var plInputControl = "<%= divShowContainer.ClientID %>";
    var defaultText = "<%= litSampleText %>";

    var hideInput = "<%= HideInput %>";

    var currentActive = "<%= CurrentActiveId %>";

    $(document).ready(function() {
        if (hideInput == "false") {
            $("#" + plInputControl).removeClass("hidden"); // show the input control panel.
        }
        
        if (currentActive != "") {
            $("#" + currentActive).addClass("active");
        }
        $(".rate-image").click(function() {
            if ($(this).hasClass("active")) {
                $(this).removeClass("active");
                $("#" + plInputControl).addClass("hidden");
            }
            else {
                // display the input control panel
                $("#" + plInputControl).removeClass("hidden");

                // set active to the right button
                $(".rate-image").removeClass("active");
                $(this).addClass("active");

                // set the value of the text box to match user selection
                $("#" + selectionItem).val($(this).attr("alt"));
            }

            return false;
        });

        // set and reset text on focus and on blur
        $("#" + txtMessageId).focus(function() {
            if ($(this).val() == defaultText) {
                $(this).val("");
            }
        });
        $("#" + txtMessageId).blur(function() {
            if ($(this).val() == "") {
                $(this).val(defaultText);
            }
        });


    });
</script>
</div>
<div class="clear"></div>
