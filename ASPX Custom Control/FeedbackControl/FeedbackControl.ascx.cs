using System;
using System.Collections.Generic;
using System.Text;
using System.Web.UI.WebControls;
using Seamless.CMS.Caching;
using Seamless.CMS.WebUI;
using Seamless.CMS;
using Seamless.Core;
using Seamless.EFM;

namespace COGB.WebUI.CustomControls
{
    /// <summary>
    /// Capture anynomous feedback from web reader and send an email to page owner and page author
    /// Feedback include: Comment & reason
    /// if no JS, the good/bad pictures will be replaced with radio buttons
    /// include a CAPTCHA to prevent hacking
    /// 
    /// Customizable fields & options: 
    /// - div css style (string)
    /// - litEmialToAuthor (bool)
    /// - litEmailToOwner (bool)
    /// - litPersonEmail email address of the person(string)
    /// - litFeedbackForm : feedback form name
    /// - litFeedbackEmail : email name
    /// - litSampleReason : default reason to be displayed on the combo box
    /// - litSampleText : default text to be displayed on the textbox
    /// </summary>

    public partial class FeedbackControl : Seamless.Web.ControlBase, ISeamlessCMSControl
    {
        #region properties

        private string _divCssStyle;
        public string DivCssStyle
        {
            get
            {
                if (_divCssStyle == null)
                    return "";
                return _divCssStyle;
            }
            set
            {
                _divCssStyle = value;
            }
        }

        private string _hideInput;
        public string HideInput
        {
            get { return _hideInput == null ? "" : _hideInput; }
            set { _hideInput = value; }
        }

        private string _currentActiveId;
        public string CurrentActiveId
        {
            get { return _currentActiveId == null ? "" : _currentActiveId; }
            set { _currentActiveId = value; }
        }
        

        public bool litEmialToAuthor
        {
            get
            {
                if (ViewState["litEmialToAuthor"] == null)
                    return false;
                return (bool)ViewState["litEmialToAuthor"];
            }
            set
            {
                ViewState["litEmialToAuthor"] = value;
            }
        }

        public bool litEmailToOwner
        {
            get
            {
                if (ViewState["litEmailToOwner"] == null)
                    return false;
                return (bool)ViewState["litEmailToOwner"];
            }
            set
            {
                ViewState["litEmailToOwner"] = value;
            }
        }

        public string litPersonEmail
        {
            get
            {
                if (ViewState["litPersonEmail"] == null)
                    return "";
                return (string)ViewState["litPersonEmail"];
            }
            set
            {
                ViewState["litPersonEmail"] = value;
            }
        }

        public string litFeedbackForm
        {
            get
            {
                if (ViewState["litFeedbackForm"] == null)
                    return "";
                return (string)ViewState["litFeedbackForm"];
            }
            set
            {
                ViewState["litFeedbackForm"] = value;
            }
        }

        public string litFeedbackEmail
        {
            get
            {
                if (ViewState["litFeedbackEmail"] == null)
                    return "";
                return (string)ViewState["litFeedbackEmail"];
            }
            set
            {
                ViewState["litFeedbackEmail"] = value;
            }
        }

        public string litSampleReason
        {
            get
            {
                if (ViewState["litSampleReason"] == null)
                    return "";
                return (string)ViewState["litSampleReason"];
            }
            set
            {
                ViewState["litSampleReason"] = value;
            }
        }

        public string litSampleText
        {
            get
            {
                if (ViewState["litSampleText"] == null)
                    return "";
                return (string)ViewState["litSampleText"];
            }
            set
            {
                ViewState["litSampleText"] = value;
            }
        }

        #endregion properties

        #region View Controllers

        protected void Page_Load(object sender, EventArgs e)
        {
            this.Page.MaintainScrollPositionOnPostBack = true;
            HideInput = "true";
            if (!IsPostBack)
                BindControls();
                
            BindData();
        }

        private void BindControls()
        {
            HideInput = "true";

            txtMessage.Text = litSampleText;
            ddlReason.Items.Clear();
            ddlReason.Items.Add(new ListItem(litSampleReason, litSampleReason));
            Form feedbackForm = FormManager.GetByNameGroup(litFeedbackForm, ((PageBase)this.Page).cache.groupId);


            foreach (Section sec in feedbackForm.listSections)
            {
                foreach (Seamless.EFM.Control con in sec.listControls)
                {
                    switch (con.description.Trim())
                    {
                        case "FeedbackReason":
                            foreach (var controlValue in con.listControlValues)
                            {
                                ddlReason.Items.Add(new ListItem(controlValue.value.Split(Convert.ToChar(167))[0], controlValue.value.Split(Convert.ToChar(167))[1]));
                            }
                            break;
                    }
                }
            }
        }

        private void BindData()
        {
            if (Session[((PageBase)this.Page).cache.contentId + "Feedback"] != null)
            {
                HideFeedbackForm();
                HideInput = "true";
            }
            else
            {
                ContentVersionCache currentPage = ((PageBase)this.Page).cache;
                plFeedbackControl.Attributes.Add("class", DivCssStyle);
                btnFacebook.NavigateUrl = btnFacebookNoJS.NavigateUrl = "http://www.facebook.com/sharer.php?u=" + currentPage.link;
                btnMail.NavigateUrl = btnMailNoJS.NavigateUrl = "mailto:someone@domain.com?subject=" + currentPage.name + "&body=" + currentPage.link;
            }
        }

        protected void submit_Click(object sender, EventArgs e)
        {
            if (Session[((PageBase)this.Page).cache.contentId + "Feedback"] == null)
                SubmitFeedbackForm();
            else
                BlockFeedbackForm(); // already send feedback for this content
        }

        private void HideFeedbackForm()
        {
            divFeedbackHeader.Visible = false;
            rateImageNoSript.Visible = false;
            divShowContainer.Visible = false;
            failMsgDiv.Visible = false;
            plFeedbackControl.Visible = false;
        }

        private void BlockFeedbackForm()
        {

            divFeedbackHeader.Visible = false;
            rateImageNoSript.Visible = false;
            divShowContainer.Visible = false;
            failMsgDiv.Visible = true;
        }

        private void SubmitFeedbackForm()
        {
            try
            {
                HideInput = "false";

                // get the content page
                ContentVersionCache cvc = ((PageBase)this.Page).cache;

                // get the author and owner of the page
                UserCache pageAuthor = cvc.author;
                UserCache pageOwner = cvc.owner;

                // get the content for email message
                string message = txtMessage.Text;
                string reason = ddlReason.SelectedValue;

                // check for error
                errorList.Items.Clear();

                string rateFace = "";
                string tempSelectedDivValue = txtSelectedDivValue.Text.ToString(); // with js,
                string tempSelectedRadioBut = rblRatings.SelectedValue.ToString(); // no js

                if (!string.IsNullOrEmpty(tempSelectedDivValue))
                {
                    CurrentActiveId = "btn" + tempSelectedDivValue; // with JS
                }
                else
                {
                    CurrentActiveId = tempSelectedRadioBut;
                }

                if (tempSelectedDivValue == "none" && rblRatings.SelectedIndex < 0)
                    errorList.Items.Add("Please rate this page before you submit");
                else if (tempSelectedDivValue != "none")
                    rateFace = tempSelectedDivValue;
                else
                    rateFace = tempSelectedRadioBut;

                if (rateFace.Equals("No") && (message.Length == 0 || message == litSampleText))
                    errorList.Items.Add("Please provide more information in the comments box to explain your rating");
                else if (rateFace.Equals("Yes") && message == litSampleText)
                    message = "No message left";

                if (reason.Length == 0 || reason == litSampleReason)
                    errorList.Items.Add("Reason for the feedback is mandatory");

                if (!rCaptcha.IsValid)
                    errorList.Items.Add("Please enter a valid captcha code");

                if (errorList.Items.Count > 0)
                {
                    errorMsgDiv.Visible = true;
                    return;
                }

                CmsEmail feedbackEmail = null;

                foreach (CmsEmail email in CmsEmailManager.GetAll())
                {
                    if (email.name.Equals(litFeedbackEmail))
                    {
                        feedbackEmail = email;
                        break;
                    }
                }

                CmsEmailAlternateView feedbackEmailView = null;
                foreach (CmsEmailAlternateView view in feedbackEmail.listCmsEmailAlternateViews)
                {
                    if (view.mimeType.Equals("text/plain"))
                    {
                        feedbackEmailView = view;
                    }
                }

                if (feedbackEmailView == null)
                    return;

                string body = "";

                if (litPersonEmail != "")
                {
                    body = string.Format(feedbackEmailView.body, "Web administrator", cvc.link, rateFace, reason, message);
                    EmailManager.Send(feedbackEmail.senderEmail, litPersonEmail, feedbackEmail.subject, body);
                }
                if (litEmailToOwner)
                {
                    body = string.Format(feedbackEmailView.body, pageOwner.fullname, cvc.link, rateFace, reason, message);
                    EmailManager.Send(feedbackEmail.senderEmail, pageOwner.email, feedbackEmail.subject, body);
                }
                if (litEmialToAuthor)
                {
                    body = string.Format(feedbackEmailView.body, pageAuthor.fullname, cvc.link, rateFace, reason, message);
                    EmailManager.Send(feedbackEmail.senderEmail, pageAuthor.email, feedbackEmail.subject, body);
                }

                Session[cvc.contentId + "Feedback"] = "true";
                divFeedbackHeader.Visible = false;
                rateImageNoSript.Visible = false;
                divShowContainer.Visible = false;
                successMsgDiv.Visible = true;

                Form feedbackForm = FormManager.GetByNameGroup(litFeedbackForm, cvc.groupId);

                FormResponse frmResponse = new FormResponse();
                frmResponse.objForm = feedbackForm;

                foreach (Section sec in feedbackForm.listSections)
                {
                    SeamlessList<Seamless.EFM.Control> controls = new SeamlessList<Seamless.EFM.Control>(sec.listControls);
                    controls.Sort(Seamless.EFM.Control.Properties.sequence);
                    foreach (Seamless.EFM.Control con in controls)
                    {

                        switch (con.description.Trim())
                        {
                            case "Rate":
                                ControlAnswer rCA = new ControlAnswer();
                                rCA.objControl = con;
                                rCA.objFormResponse = frmResponse;
                                rCA.value = rateFace;
                                frmResponse.listControlAnswers.Add(rCA);
                                break;
                            case "FeedbackReason":
                                ControlAnswer frCA = new ControlAnswer();
                                frCA.objControl = con;
                                frCA.objFormResponse = frmResponse;
                                frCA.value = reason;
                                frmResponse.listControlAnswers.Add(frCA);
                                break;
                            case "FeedbackMessage":
                                ControlAnswer fmCA = new ControlAnswer();
                                fmCA.objControl = con;
                                fmCA.objFormResponse = frmResponse;
                                fmCA.value = message;
                                frmResponse.listControlAnswers.Add(fmCA);
                                break;
                            case "ContentLink":
                                ControlAnswer clCA = new ControlAnswer();
                                clCA.objControl = con;
                                clCA.objFormResponse = frmResponse;
                                clCA.value = cvc.link;
                                frmResponse.listControlAnswers.Add(clCA);
                                break;
                        }
                    }
                }
                frmResponse.userId = _user.id;
                frmResponse.submitDate = DateTime.Now;

                frmResponse.isCompleted = true;
                FormResponseManager.Save(frmResponse);
                foreach (ControlAnswer ca in frmResponse.listControlAnswers)
                {
                    ControlAnswerManager.Save(ca);
                }
            }
            catch (Exception exp)
            {
                ExceptionManager.Log(exp);
                errorList.Items.Add("Error, Please try again later.");
                errorMsgDiv.Visible = true;
            }
        }

        #endregion View Controllers

        #region ISeamlessCMSControl Members

        List<CustomControlProperty> ISeamlessCMSControl.GetProperties()
        {
            List<CustomControlProperty> ccpList = new List<CustomControlProperty>();

            CustomControlProperty ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.RadiobuttonList;
            ccp.name = "litEmialToAuthor";
            ccp.description = "Send email to content author?";
            ccp.propertyType = "bool";
            ccp.controlValues.Add(new ListItem("No", "false", true));
            ccp.controlValues.Add(new ListItem("Yes", "true"));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.RadiobuttonList;
            ccp.name = "litEmailToOwner";
            ccp.description = "Send email to content owner?";
            ccp.propertyType = "bool";
            ccp.controlValues.Add(new ListItem("No", "false", true));
            ccp.controlValues.Add(new ListItem("Yes", "true"));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.Textbox;
            ccp.name = "litPersonEmail";
            ccp.description = "Default email address to send email to(Leave blank if not necessary).";
            ccp.propertyType = "string";
            ccp.controlValues.Add(new ListItem(""));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.Textbox;
            ccp.name = "litFeedbackForm";
            ccp.description = "Name of the feedback form.";
            ccp.propertyType = "string";
            ccp.controlValues.Add(new ListItem(""));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.Textbox;
            ccp.name = "litFeedbackEmail";
            ccp.description = "Name of the feedback email template.";
            ccp.propertyType = "string";
            ccp.controlValues.Add(new ListItem(""));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.Textbox;
            ccp.name = "litSampleReason";
            ccp.description = "Default text for reason combo box";
            ccp.propertyType = "string";
            ccp.controlValues.Add(new ListItem(""));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.Textarea;
            ccp.name = "litSampleText";
            ccp.description = "Default text for comment text area";
            ccp.propertyType = "string";
            ccp.controlValues.Add(new ListItem("Please provide comments and a reason for your rating. The Nillumbik Shire Council thanks you for taking the time to rate the information on this page."));
            ccpList.Add(ccp);

            ccp = new CustomControlProperty();
            ccp.controlType = CustomControlProperty.ControlTypes.Textarea;
            ccp.name = "DivCssStyle";
            ccp.description = "Css style for the div container (optional)";
            ccp.propertyType = "string";
            ccp.controlValues.Add(new ListItem(""));
            ccpList.Add(ccp);


            return ccpList;
        }

        #endregion
    }
}